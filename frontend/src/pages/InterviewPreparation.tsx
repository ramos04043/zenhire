import { API_BASE } from '../lib/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import {
  Brain, BookOpen, CheckCircle, Clock, Target,
  Play, Lightbulb, Loader2, AlertCircle, ChevronDown,
  ChevronUp, Send, Star, Mic, Sparkles
} from 'lucide-react'
import { useOnboardingStore } from '../store/onboardingStore'
import toast from 'react-hot-toast'

type Category = 'technical' | 'behavioral' | 'system-design' | 'mixed'

interface Question {
  id: number
  question: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  hint?: string
  sample_answer?: string
}

interface Evaluation {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  model_answer_hint: string
}

const diffColor = (d: string) =>
  d === 'Easy'   ? 'bg-green-500/10 text-green-400 border-green-500/20'
  : d === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  : 'bg-red-500/10 text-red-400 border-red-500/20'

const ScoreBar = ({ score }: { score: number }) => {
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f97316' : '#f87171'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-sm font-bold" style={{ color }}>{score}/100</span>
    </div>
  )
}

const InterviewPreparation = () => {
  const { profile } = useOnboardingStore()
  const navigate = useNavigate()

  const [category, setCategory] = useState<Category>('mixed')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null)
  const [answer, setAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [expandedHint, setExpandedHint] = useState<number | null>(null)
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set())

  const generateQuestions = async () => {
    setLoading(true)
    setError('')
    setQuestions([])
    setActiveQuestion(null)
    setEvaluation(null)
    toast.loading('Generating questions…', { id: 'gen' })
    try {
      const resp = await fetch(`${API_BASE}/interview-prep/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: profile.desiredJobTitle || profile.currentJobTitle || 'Software Developer',
          skills: profile.skills || [],
          experience_level: profile.experienceLevel || 'mid',
          category,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Failed')
      setQuestions(data.questions || [])
      toast.success(`${data.total} questions ready`, { id: 'gen' })
    } catch (e: any) {
      setError(e.message)
      toast.error(e.message, { id: 'gen' })
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!activeQuestion || !answer.trim()) { toast.error('Write your answer first'); return }
    setEvaluating(true)
    toast.loading('Evaluating…', { id: 'eval' })
    try {
      const resp = await fetch(`${API_BASE}/interview-prep/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          answer: answer.trim(),
          job_title: profile.desiredJobTitle || profile.currentJobTitle || 'Software Developer',
          category: activeQuestion.category,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Evaluation failed')
      setEvaluation(data)
      setCompletedIds(prev => new Set(prev).add(activeQuestion.id))
      toast.success('Answer evaluated!', { id: 'eval' })
    } catch (e: any) {
      toast.error(e.message, { id: 'eval' })
    } finally {
      setEvaluating(false)
    }
  }

  const categories: { id: Category; label: string; icon: React.ElementType }[] = [
    { id: 'mixed',         label: 'Mixed',         icon: Star },
    { id: 'technical',     label: 'Technical',     icon: Brain },
    { id: 'behavioral',    label: 'Behavioral',    icon: Lightbulb },
    { id: 'system-design', label: 'System Design', icon: Target },
  ]

  // shared style tokens
  const CARD = 'bg-[#161616] border border-[#252525] rounded-xl'
  const BTN_OUTLINE = 'bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-lg transition-colors'

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#f97316]" />
            <div>
              <h1 className="text-xl font-bold text-white">Interview Preparation</h1>
              <p className="text-xs text-[#555]">
                AI-generated questions tailored to your profile
                {profile.desiredJobTitle && <span className="ml-1.5 text-[#f97316] font-semibold">· {profile.desiredJobTitle}</span>}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/voice-interview')}
            className="flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-[#f97316]/20">
            <Mic size={14} /> Voice Interview
          </button>
        </div>

        <div className="grid grid-cols-3 gap-5">

          {/* ── Left: Questions ── */}
          <div className="col-span-2 space-y-4">

            {/* Controls */}
            <div className={`${CARD} p-5`}>
              <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-4">Generate Questions</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      category === cat.id
                        ? 'bg-[#f97316] text-white'
                        : `${BTN_OUTLINE} text-xs`
                    }`}>
                    <cat.icon size={13} />{cat.label}
                  </button>
                ))}
              </div>
              <button onClick={generateQuestions} disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f97316] hover:bg-[#ea6a0f] disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {loading ? 'Generating…' : questions.length ? 'Regenerate' : 'Generate Questions'}
              </button>
              {error && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Question cards */}
            {questions.length > 0 && (
              <div className="space-y-2.5">
                {questions.map(q => (
                  <div key={q.id}
                    className={`${CARD} overflow-hidden transition-colors ${activeQuestion?.id === q.id ? 'border-[#f97316]/40' : ''}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                          <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#252525] text-[#555] text-[10px] rounded capitalize">{q.category}</span>
                          {completedIds.has(q.id) && <CheckCircle size={13} className="text-green-400" />}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {q.hint && (
                            <button onClick={() => setExpandedHint(expandedHint === q.id ? null : q.id)}
                              className="text-[10px] text-[#555] hover:text-yellow-400 transition-colors flex items-center gap-1">
                              <Lightbulb size={12} />Hint
                              {expandedHint === q.id ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                            </button>
                          )}
                          <button onClick={() => { setActiveQuestion(q); setAnswer(''); setEvaluation(null) }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-lg text-[10px] font-bold transition-colors">
                            <Play size={11} />Practice
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-white font-medium leading-relaxed">{q.question}</p>
                      {expandedHint === q.id && q.hint && (
                        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-xs text-yellow-400">{q.hint}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && questions.length === 0 && !error && (
              <div className={`${CARD} text-center py-16`}>
                <Brain size={36} className="text-[#2a2a2a] mx-auto mb-3" />
                <p className="text-[#555] text-sm mb-1">No questions yet</p>
                <p className="text-[#444] text-xs">Pick a category and click Generate</p>
              </div>
            )}
          </div>

          {/* ── Right: Panel ── */}
          <div className="space-y-4">

            {activeQuestion ? (
              <div className={`${CARD} p-5 border-[#f97316]/20`}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={14} className="text-[#f97316]" />
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Practice Answer</p>
                </div>
                <div className="p-3 bg-[#0d0d0d] border border-[#252525] rounded-lg mb-3">
                  <p className="text-sm text-white leading-relaxed">{activeQuestion.question}</p>
                </div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)}
                  placeholder="Type your answer here…" rows={7}
                  className="w-full px-3 py-2.5 bg-[#0d0d0d] border border-[#252525] rounded-lg text-sm text-white focus:border-[#f97316]/50 focus:outline-none resize-none mb-3" />
                <button onClick={submitAnswer} disabled={evaluating || !answer.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f97316] hover:bg-[#ea6a0f] disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors">
                  {evaluating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {evaluating ? 'Evaluating…' : 'Submit Answer'}
                </button>

                {evaluation && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#555] uppercase tracking-wider mb-2">Score</p>
                      <ScoreBar score={evaluation.score} />
                    </div>
                    <div className="p-3 bg-[#0d0d0d] border border-[#252525] rounded-lg">
                      <p className="text-[10px] text-[#f97316] font-bold uppercase tracking-wider mb-1">Feedback</p>
                      <p className="text-xs text-[#999] leading-relaxed">{evaluation.feedback}</p>
                    </div>
                    {evaluation.strengths.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-green-400 uppercase tracking-wider mb-2">Strengths</p>
                        <ul className="space-y-1">
                          {evaluation.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#999]">
                              <CheckCircle size={11} className="text-green-400 flex-shrink-0 mt-0.5" />{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {evaluation.improvements.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-2">Improve</p>
                        <ul className="space-y-1">
                          {evaluation.improvements.map((imp, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#999]">
                              <AlertCircle size={11} className="text-yellow-400 flex-shrink-0 mt-0.5" />{imp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {evaluation.model_answer_hint && (
                      <div className="p-3 bg-[#f97316]/10 border border-[#f97316]/20 rounded-lg">
                        <p className="text-[10px] font-bold text-[#f97316] mb-1">Model Answer Hint</p>
                        <p className="text-xs text-[#999] leading-relaxed">{evaluation.model_answer_hint}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Voice Interview CTA */}
                <div className="bg-[#f97316]/5 border border-[#f97316]/20 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-[#f97316]/10 rounded-lg flex items-center justify-center">
                      <Mic size={18} className="text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">AI Voice Interview</p>
                      <p className="text-xs text-[#555]">Speak your answers in real time</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#555] mb-4 leading-relaxed">
                    Full mock interview — AI reads questions aloud, listens, then gives a scored report.
                  </p>
                  <button onClick={() => navigate('/voice-interview')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-lg font-semibold text-xs transition-colors">
                    <Mic size={13} />Start Voice Interview
                  </button>
                </div>

                {/* Text practice */}
                <div className={`${CARD} p-5`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-[#1a1a1a] border border-[#252525] rounded-lg flex items-center justify-center">
                      <Brain size={18} className="text-[#f97316]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Text Practice</p>
                      <p className="text-xs text-[#555]">Type answers, get AI feedback</p>
                    </div>
                  </div>
                  <button onClick={generateQuestions} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-lg font-semibold text-xs transition-colors disabled:opacity-50">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    {loading ? 'Generating…' : 'Start Text Practice'}
                  </button>
                </div>
              </div>
            )}

            {/* Progress */}
            {questions.length > 0 && (
              <div className={`${CARD} p-4`}>
                <p className="text-xs font-bold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Clock size={12} className="text-[#f97316]" />Session Progress
                </p>
                <div className="flex justify-between text-xs text-[#555] mb-1.5">
                  <span>Completed</span>
                  <span className="text-green-400 font-semibold">{completedIds.size} / {questions.length}</span>
                </div>
                <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-green-400 rounded-full transition-all duration-700"
                    style={{ width: `${(completedIds.size / questions.length) * 100}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {(['Easy', 'Medium', 'Hard'] as const).map(d => (
                    <div key={d} className="p-2 bg-[#0d0d0d] border border-[#252525] rounded-lg">
                      <p className={`text-xs font-bold ${d === 'Easy' ? 'text-green-400' : d === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {questions.filter(q => q.difficulty === d).length}
                      </p>
                      <p className="text-[10px] text-[#444]">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className={`${CARD} p-4`}>
              <p className="text-xs font-bold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen size={12} className="text-[#f97316]" />Quick Tips
              </p>
              <ul className="space-y-2">
                {[
                  'Use STAR method for behavioral questions',
                  'Think out loud in technical interviews',
                  'Clarify before answering system design',
                  'Quantify achievements with numbers',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#666]">
                    <CheckCircle size={11} className="text-[#f97316] flex-shrink-0 mt-0.5" />{tip}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InterviewPreparation
