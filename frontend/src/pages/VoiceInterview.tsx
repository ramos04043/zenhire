/**
 * VoiceInterview.tsx
 * Full-screen AI voice interview.
 * - Browser SpeechSynthesis reads questions aloud
 * - Browser SpeechRecognition transcribes answers in real time
 * - Groq backend evaluates the full session and returns a report
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, Volume2, VolumeX, ChevronRight, X, RotateCcw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useOnboardingStore } from '../store/onboardingStore'
import toast from 'react-hot-toast'

// ── Types ─────────────────────────────────────────────────────────────────────
interface VoiceQuestion {
  id: number
  question: string
  category: string
  difficulty: string
  spoken_intro: string
}

interface QAPair {
  question: string
  answer: string
  category: string
}

interface QuestionResult {
  id: number
  score: number
  feedback: string
  key_missing: string
}

interface SessionReport {
  overall_score: number
  overall_feedback: string
  hire_likelihood: string
  top_strengths: string[]
  top_improvements: string[]
  question_results: QuestionResult[]
}

type Stage = 'setup' | 'loading' | 'intro' | 'questioning' | 'evaluating' | 'report'

// ── Speech helpers ────────────────────────────────────────────────────────────
const speak = (text: string, onEnd?: () => void) => {
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.rate = 0.92
  utt.pitch = 1
  utt.volume = 1
  // Prefer a natural-sounding English voice
  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Neural'))
  ) || voices.find(v => v.lang.startsWith('en'))
  if (preferred) utt.voice = preferred
  if (onEnd) utt.onend = onEnd
  window.speechSynthesis.speak(utt)
}

const stopSpeaking = () => window.speechSynthesis.cancel()

// SpeechRecognition cross-browser shim
const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

// ── Subcomponents ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 96 }: { score: number; size?: number }) => {
  const r = size / 2 - 9
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f97316' : '#f87171'
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1f2937" strokeWidth={8} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  )
}

const MicWave = ({ active }: { active: boolean }) => {
  const heights = [14, 22, 30, 18, 26]
  return (
    <>
      <style>{`
        @keyframes micbar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
      <div className="flex items-center justify-center gap-1 h-8">
        {heights.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-[#f97316]"
            style={{
              height: `${h}px`,
              opacity: active ? 1 : 0.2,
              transform: active ? undefined : 'scaleY(0.2)',
              transformOrigin: 'center',
              transition: `opacity 0.2s, transform 0.2s`,
              animation: active ? `micbar ${0.45 + i * 0.07}s ease-in-out infinite alternate` : 'none',
              animationDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function VoiceInterview() {
  const navigate = useNavigate()
  const { profile } = useOnboardingStore()

  // Setup form
  const [numQuestions, setNumQuestions] = useState(5)
  const [category, setCategory] = useState<'mixed' | 'technical' | 'behavioral' | 'system-design'>('mixed')
  const [company, setCompany] = useState('')
  const [muteAI, setMuteAI] = useState(false)

  // Session state
  const [stage, setStage] = useState<Stage>('setup')
  const [questions, setQuestions] = useState<VoiceQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [pairs, setPairs] = useState<QAPair[]>([])
  const [report, setReport] = useState<SessionReport | null>(null)

  // Recording state
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recogRef = useRef<any>(null)
  const answerRef = useRef('')  // track current answer without stale closure

  // answerRef is now synced directly inside onresult for zero-delay accuracy

  // Cleanup on unmount
  useEffect(() => () => {
    stopSpeaking()
    stopListening()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  // ── Speech Recognition ──────────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!SR) { toast.error('Speech recognition requires Chrome or Edge.'); return }

    // Stop any existing session first
    if (recogRef.current) {
      try { recogRef.current.stop() } catch {}
      recogRef.current = null
    }

    const recog = new SR()
    recog.continuous = true
    recog.interimResults = true
    recog.lang = 'en-US'
    recog.maxAlternatives = 1

    recog.onresult = (e: any) => {
      let finalText = ''
      let interimText = ''
      // Separate final and interim results to avoid duplication
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + ' '
        } else {
          interimText += e.results[i][0].transcript
        }
      }
      const combined = (finalText + interimText).trim()
      setTranscript(combined)
      // Sync ref immediately — don't wait for useEffect
      answerRef.current = combined
    }

    recog.onerror = (e: any) => {
      // 'no-speech' and 'audio-capture' are non-fatal — just restart
      if (e.error === 'no-speech' || e.error === 'audio-capture') {
        // Will auto-restart via onend
        return
      }
      if (e.error === 'not-allowed') {
        toast.error('Microphone permission denied. Please allow microphone access.')
        setIsListening(false)
      }
    }

    recog.onend = () => {
      // Chrome stops recognition randomly — auto-restart if we're still supposed to be listening
      if (recogRef.current === recog) {
        // Still the active recognizer — restart it
        try {
          recog.start()
        } catch {
          // Can't restart (e.g. already started) — create a new one
          recogRef.current = null
          setIsListening(false)
          // Small delay then restart
          setTimeout(() => {
            if (recogRef.current === null) startListening()
          }, 200)
        }
      }
    }

    recogRef.current = recog
    try {
      recog.start()
      setIsListening(true)
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setIsListening(false)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recogRef.current) {
      const recog = recogRef.current
      recogRef.current = null   // Clear ref FIRST so onend doesn't restart
      try { recog.stop() } catch {}
    }
    setIsListening(false)
  }, [])

  // ── Timer ───────────────────────────────────────────────────────────────────
  const startTimer = useCallback((seconds: number, onExpire: () => void) => {
    setTimeLeft(seconds)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ── Ask a question ───────────────────────────────────────────────────────────
  const askQuestion = useCallback((idx: number, qs: VoiceQuestion[]) => {
    const q = qs[idx]
    if (!q) return
    setTranscript('')
    answerRef.current = ''

    const intro = q.spoken_intro ? `${q.spoken_intro} ` : ''
    const toSpeak = `${intro}${q.question}`

    if (!muteAI) {
      setIsSpeaking(true)
      speak(toSpeak, () => {
        setIsSpeaking(false)
        startListening()
        startTimer(120, () => {   // 2 min per question
          stopListening()
          moveToNext(idx, answerRef.current, qs)
        })
      })
    } else {
      startListening()
      startTimer(120, () => {
        stopListening()
        moveToNext(idx, answerRef.current, qs)
      })
    }
  }, [muteAI, startListening, stopListening, startTimer])

  // ── Move to next question or finish ─────────────────────────────────────────
  const moveToNext = useCallback((idx: number, answer: string, qs: VoiceQuestion[]) => {
    // Stop listening and clear timer
    stopListening()
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }

    const q = qs[idx]
    const finalAnswer = answer.trim() || answerRef.current.trim() || '(no answer given)'
    const pair: QAPair = { question: q.question, answer: finalAnswer, category: q.category }

    // Reset transcript and ref for next question
    setTranscript('')
    answerRef.current = ''

    setPairs(prev => {
      const updated = [...prev, pair]
      if (idx + 1 >= qs.length) {
        setStage('evaluating')
        evaluateSession(updated, qs[0]?.category ?? 'mixed')
      } else {
        setCurrentIdx(idx + 1)
        // Small delay so stopListening fully settles before we start again
        setTimeout(() => askQuestion(idx + 1, qs), 300)
      }
      return updated
    })
  }, [stopListening, askQuestion])

  // ── Submit answer manually ───────────────────────────────────────────────────
  const submitAnswer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
    stopSpeaking()
    // Use answerRef (synced in onresult) as authoritative — transcript state may lag
    const captured = answerRef.current.trim() || transcript.trim()
    moveToNext(currentIdx, captured, questions)
  }

  // ── Start session ────────────────────────────────────────────────────────────
  const startSession = async () => {
    setStage('loading')
    try {
      const resp = await fetch('/local-api/interview-prep/voice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: profile.desiredJobTitle || profile.currentJobTitle || 'Software Developer',
          company: company.trim() || '',
          skills: profile.skills || [],
          experience_level: profile.experienceLevel || 'mid',
          resume_summary: profile.resumeSummary || '',
          experience: profile.currentJobTitle
            ? [{ title: profile.currentJobTitle, company: profile.previousCompanies?.[0] || '', duration: '' }]
            : [],
          category,
          num_questions: numQuestions,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Failed to create session')

      setQuestions(data.questions)
      setPairs([])
      setCurrentIdx(0)
      setStage('intro')

      // Read opening message then start first question
      if (!muteAI) {
        setIsSpeaking(true)
        speak(data.opening_message, () => {
          setIsSpeaking(false)
          askQuestion(0, data.questions)
        })
      } else {
        askQuestion(0, data.questions)
      }
      setStage('questioning')
    } catch (e: any) {
      toast.error(e.message || 'Failed to start session')
      setStage('setup')
    }
  }

  // ── Evaluate full session ────────────────────────────────────────────────────
  const evaluateSession = async (allPairs: QAPair[], jobTitle: string) => {
    try {
      const resp = await fetch('/local-api/interview-prep/voice-session/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: profile.desiredJobTitle || profile.currentJobTitle || jobTitle,
          pairs: allPairs,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Evaluation failed')

      setReport(data)
      setStage('report')

      if (!muteAI) {
        speak(data.overall_feedback)
      }
    } catch (e: any) {
      toast.error(e.message || 'Evaluation failed')
      setStage('report')
    }
  }

  const resetSession = () => {
    stopSpeaking()
    stopListening()
    if (timerRef.current) clearInterval(timerRef.current)
    setStage('setup')
    setQuestions([])
    setPairs([])
    setReport(null)
    setCurrentIdx(0)
    setTranscript('')
  }

  const hireBadgeColor = (h: string) =>
    h === 'Strong Yes' ? 'bg-green-500/20 text-green-400 border-green-500/30'
    : h === 'Yes' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    : h === 'Maybe' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    : 'bg-red-500/20 text-red-400 border-red-500/30'

  if (stage === 'setup') return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <button onClick={() => navigate('/interview-preparation')}
          className="flex items-center gap-2 text-[#555] hover:text-white text-sm mb-8 transition-colors">
          <X size={16} /> Back to Interview Prep
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 mb-4">
            <Mic size={28} className="text-[#f97316]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Voice Interview</h1>
          <p className="text-[#555] text-sm">
            {profile.resumeAnalyzed
              ? `Questions tailored for ${profile.desiredJobTitle || 'your role'}`
              : 'Simulate a real interview with AI'}
          </p>
        </div>

        <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-2">
              Company name <span className="text-[#333] normal-case font-normal">(optional)</span>
            </label>
            <input value={company} onChange={e => setCompany(e.target.value)}
              placeholder="e.g., Google"
              className="w-full px-4 py-2.5 bg-[#0d0d0d] border border-[#252525] rounded-lg text-white text-sm focus:border-[#f97316]/50 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-2">Focus area</label>
            <div className="grid grid-cols-2 gap-2">
              {([['mixed','Mixed'], ['technical','Technical'], ['behavioral','Behavioral'], ['system-design','System Design']] as const).map(([val, label]) => (
                <button key={val} onClick={() => setCategory(val)}
                  className={`py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    category === val
                      ? 'bg-[#f97316] text-white'
                      : 'bg-[#0d0d0d] text-[#666] border border-[#252525] hover:border-[#333]'
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#555] uppercase tracking-wider mb-2">
              Questions: <span className="text-[#f97316] font-bold">{numQuestions}</span>
            </label>
            <input type="range" min={3} max={8} value={numQuestions}
              onChange={e => setNumQuestions(+e.target.value)}
              className="w-full accent-[#f97316]" />
            <div className="flex justify-between text-xs text-[#444] mt-1"><span>3 (quick)</span><span>8 (full)</span></div>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#0d0d0d] rounded-lg border border-[#252525]">
            <div>
              <p className="text-sm font-medium text-white">AI voice</p>
              <p className="text-xs text-[#555]">AI reads questions aloud</p>
            </div>
            <button onClick={() => setMuteAI(m => !m)}
              className={`p-2 rounded-lg transition-colors ${muteAI ? 'bg-[#1a1a1a] text-[#444]' : 'bg-[#f97316]/10 text-[#f97316]'}`}>
              {muteAI ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <button onClick={startSession}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#f97316]/20">
            <Mic size={18} /> Start Voice Interview
          </button>
        </div>

        {!SR && (
          <p className="text-center text-xs text-red-400 mt-4">
            ⚠ Speech recognition requires Chrome or Edge.
          </p>
        )}
      </div>
    </div>
  )

  if (stage === 'loading') return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <Loader2 size={40} className="text-[#f97316] animate-spin" />
      <p className="text-white font-semibold">Preparing your interview…</p>
      <p className="text-[#555] text-sm">Generating personalised questions from your resume</p>
    </div>
  )

  if (stage === 'evaluating') return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
      <Loader2 size={40} className="text-[#f97316] animate-spin" />
      <p className="text-white font-semibold">Evaluating your performance…</p>
      <p className="text-[#555] text-sm">AI is reviewing all {pairs.length} answers</p>
    </div>
  )

  if (stage === 'questioning' || stage === 'intro') {
    const q = questions[currentIdx]
    const progress = questions.length > 0 ? (currentIdx / questions.length) * 100 : 0
    const mins = Math.floor(timeLeft / 60)
    const secs = timeLeft % 60

    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-white">Live Interview</span>
            <span className="text-xs text-[#555]">{profile.desiredJobTitle || 'Software Developer'}{company ? ` · ${company}` : ''}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMuteAI(m => !m)}
              className="p-2 rounded-lg bg-[#161616] border border-[#252525] text-[#555] hover:text-white transition-colors">
              {muteAI ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button onClick={resetSession}
              className="p-2 rounded-lg bg-[#161616] border border-[#252525] text-[#555] hover:text-red-400 transition-colors">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-[#1a1a1a]">
          <div className="h-full bg-[#f97316] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-2xl mx-auto w-full">
          {/* Step dots */}
          <div className="flex items-center gap-2 mb-6">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
                i < currentIdx ? 'w-8 bg-green-400'
                : i === currentIdx ? 'w-8 bg-[#f97316]'
                : 'w-4 bg-[#252525]'
              }`} />
            ))}
          </div>

          <p className="text-xs font-bold text-[#444] uppercase tracking-widest mb-2">
            Question {currentIdx + 1} of {questions.length}
          </p>

          {q && (
            <div className="w-full bg-[#161616] border border-[#252525] rounded-2xl p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                  q.difficulty === 'Easy'   ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {q.difficulty}
                </span>
                <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#252525] text-[#555] text-xs rounded capitalize">
                  {q.category}
                </span>
              </div>
              <p className="text-white text-xl font-medium leading-relaxed">{q.question}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 w-full">
            {isSpeaking ? (
              <div className="flex items-center gap-2 text-[#f97316]">
                <Volume2 size={18} className="animate-pulse" />
                <span className="text-sm font-semibold">AI is speaking…</span>
              </div>
            ) : (
              <button
                onClick={() => isListening ? stopListening() : startListening()}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isListening
                    ? 'bg-red-500 shadow-red-500/30 scale-110'
                    : 'bg-[#f97316] shadow-[#f97316]/30 hover:scale-105 hover:bg-[#ea6a0f]'
                }`}>
                {isListening ? <MicOff size={26} className="text-white" /> : <Mic size={26} className="text-white" />}
              </button>
            )}

            <MicWave active={isListening} />

            {/* Transcript box — editable so user can fix misheard words */}
            <div className="w-full relative">
              <textarea
                value={transcript}
                onChange={e => {
                  setTranscript(e.target.value)
                  answerRef.current = e.target.value
                }}
                placeholder={isListening ? 'Listening… speak your answer' : 'Press the mic to start speaking, or type your answer here'}
                rows={4}
                className="w-full p-4 bg-[#161616] border border-[#252525] rounded-xl text-sm text-[#ccc] leading-relaxed resize-none focus:border-[#f97316]/40 focus:outline-none placeholder-[#444]"
              />
              {/* Status indicator */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {isListening && (
                  <span className="flex items-center gap-1 text-[10px] text-[#f97316] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] animate-pulse" />
                    Live
                  </span>
                )}
                {transcript.trim() && (
                  <button
                    onClick={() => { setTranscript(''); answerRef.current = '' }}
                    className="text-[#444] hover:text-[#999] transition-colors text-[10px]"
                    title="Clear transcript"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              {/* Character count */}
              {transcript.length > 0 && (
                <p className="absolute bottom-2 right-3 text-[10px] text-[#444]">
                  {transcript.split(/\s+/).filter(Boolean).length} words
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 w-full">
              {timeLeft > 0 && (
                <span className={`text-sm font-mono font-bold ${timeLeft <= 20 ? 'text-red-400' : 'text-[#555]'}`}>
                  {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </span>
              )}
              <button onClick={submitAnswer}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl font-semibold text-sm transition-all">
                {currentIdx + 1 >= questions.length ? 'Finish Interview' : 'Next Question'}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === 'report' && report) {
    const scoreColor = report.overall_score >= 80 ? '#4ade80' : report.overall_score >= 60 ? '#f97316' : '#f87171'
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Interview Report</h1>
              <p className="text-[#555] text-sm mt-1">{profile.desiredJobTitle || 'Software Developer'}{company ? ` · ${company}` : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={resetSession}
                className="flex items-center gap-2 px-4 py-2 bg-[#161616] border border-[#252525] hover:border-[#f97316]/30 text-[#999] hover:text-white rounded-xl text-sm font-semibold transition-colors">
                <RotateCcw size={14} /> Retry
              </button>
              <button onClick={() => navigate('/interview-preparation')}
                className="flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl text-sm font-semibold transition-colors">
                Done
              </button>
            </div>
          </div>

          {/* Score + verdict */}
          <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 mb-5 flex items-center gap-8">
            <div className="relative flex-shrink-0">
              <ScoreRing score={report.overall_score} />
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold" style={{ color: scoreColor }}>
                {report.overall_score}
              </span>
            </div>
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border mb-2 ${hireBadgeColor(report.hire_likelihood)}`}>
                {report.hire_likelihood}
              </span>
              <p className="text-[#999] text-sm leading-relaxed">{report.overall_feedback}</p>
            </div>
          </div>

          {/* Strengths + Improvements */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-[#161616] border border-[#252525] rounded-xl p-5">
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Top Strengths</p>
              <ul className="space-y-2">
                {report.top_strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#999]">
                    <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#161616] border border-[#252525] rounded-xl p-5">
              <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-3">Improve On</p>
              <ul className="space-y-2">
                {report.top_improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#999]">
                    <AlertCircle size={13} className="text-yellow-400 flex-shrink-0 mt-0.5" />{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252525]">
              <h3 className="text-sm font-bold text-white">Question Breakdown</h3>
            </div>
            <div className="divide-y divide-[#1e1e1e]">
              {pairs.map((pair, i) => {
                const result = report.question_results.find(r => r.id === i + 1)
                const sc = result?.score ?? 0
                const scColor = sc >= 80 ? 'text-green-400' : sc >= 60 ? 'text-yellow-400' : 'text-red-400'
                return (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <p className="text-sm font-medium text-white flex-1">Q{i+1}: {pair.question}</p>
                      <span className={`text-sm font-bold flex-shrink-0 ${scColor}`}>{sc}/100</span>
                    </div>
                    <div className="h-1 bg-[#1a1a1a] rounded-full mb-2">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${sc}%`, backgroundColor: sc >= 80 ? '#4ade80' : sc >= 60 ? '#f97316' : '#f87171' }} />
                    </div>
                    {result?.feedback && <p className="text-xs text-[#666] mb-1">{result.feedback}</p>}
                    {result?.key_missing && <p className="text-xs text-yellow-500/80">Missing: {result.key_missing}</p>}
                    <details className="mt-2">
                      <summary className="text-xs text-[#444] cursor-pointer hover:text-[#999]">Your answer</summary>
                      <p className="text-xs text-[#555] mt-1 pl-3 border-l border-[#252525] italic">{pair.answer}</p>
                    </details>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
