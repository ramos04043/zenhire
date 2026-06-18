import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Lock, Target,  CheckCircle,
  FileText, X, Loader2, AlertTriangle, ChevronRight, Briefcase, Sparkles
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { resumeAIService } from '../services/resumeAIService'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import toast from 'react-hot-toast'

type Status = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'

interface AnalysisResult {
  atsScore: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  keywords: { matching: string[]; missing: string[]; matchPercentage: number }
  parsed: { name?: string; summary?: string; skills?: string[]; experience?: any[]; education?: any[] }
}

const ResumePage = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName]     = useState<string | null>(null)
  const [status, setStatus]         = useState<Status>('idle')
  const [progress, setProgress]     = useState(0)
  const [analysis, setAnalysis]     = useState<AnalysisResult | null>(null)
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)

  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { setProfileFromResume } = useOnboardingStore()

  const reset = () => {
    setFileName(null); setStatus('idle'); setProgress(0)
    setAnalysis(null); setErrorMsg(null)
  }

  // ── upload + analysis ────────────────────────────────────────────────────

  const handleFileUpload = async (file: File) => {
    if (!user) { toast.error('Please log in first'); return }
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!validTypes.includes(file.type)) { toast.error('Please upload a PDF, DOCX, or TXT file'); return }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10 MB'); return }

    setFileName(file.name); setStatus('uploading'); setProgress(15); setAnalysis(null); setErrorMsg(null)

    try {
      setStatus('processing')
      toast.loading('AI is analyzing your resume…', { id: 'resume' })
      setProgress(40)

      const aiResult = await resumeAIService.analyzeResume(file)
      setProgress(90)

      const parsed = aiResult.parsed_data
      setAnalysis({
        atsScore: aiResult.ats_analysis.score,
        strengths: aiResult.ats_analysis.strengths,
        weaknesses: aiResult.ats_analysis.weaknesses,
        recommendations: aiResult.ats_analysis.recommendations,
        keywords: {
          matching: aiResult.ats_analysis.keyword_analysis.matching_skills,
          missing: aiResult.ats_analysis.keyword_analysis.missing_skills,
          matchPercentage: aiResult.ats_analysis.keyword_analysis.match_percentage,
        },
        parsed,
      })

      // Populate onboarding profile from resume data
      setProfileFromResume(aiResult)
      setStatus('completed')
      toast.success('Analysis complete!', { id: 'resume' })
    } catch (err: any) {
      const msg = err?.message || 'Something went wrong. Please try again.'
      console.error('[Resume] analysis failed:', err)
      setStatus('failed'); setErrorMsg(msg)
      toast.error(msg, { id: 'resume' })
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    if (e.dataTransfer.files[0]) await handleFileUpload(e.dataTransfer.files[0])
  }
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) await handleFileUpload(e.target.files[0])
  }

  const scoreColor = (s: number) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-dark-accent' : 'text-red-400'
  const scoreRingColor = (s: number) => s >= 80 ? '#4ade80' : s >= 60 ? '#f97316' : '#f87171'

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── IDLE ── */}
        {status === 'idle' && (
          <>
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-accent/10 border border-dark-accent/20 rounded-full mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-dark-accent" />
                <span className="text-xs font-bold text-dark-accent uppercase tracking-widest">AI-powered · Free</span>
              </div>
              <h2 className="text-3xl font-bold text-dark-text-primary mb-2">AI Resume Analyzer</h2>
              <p className="text-dark-text-secondary max-w-lg mx-auto text-sm">
                Upload your resume — AI analyzes it, builds your career profile, and finds matching jobs
              </p>
            </div>

            <div
              className={`p-12 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${isDragging ? 'border-dark-accent bg-dark-accent/5' : 'border-dark-border hover:border-dark-accent/40'}`}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-dark-accent/10 rounded-full mb-4">
                  <Upload size={24} className="text-dark-accent" />
                </div>
                <h3 className="text-base font-semibold text-dark-text-primary mb-1">Upload Resume</h3>
                <p className="text-sm text-dark-text-secondary mb-5">Drag & drop or click to browse</p>
                <label>
                  <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileSelect} />
                  <span className="inline-block px-6 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                    Choose file
                  </span>
                </label>
                <div className="flex items-center justify-center gap-2 mt-4">
                  {['PDF', 'DOCX', 'TXT', 'Max 10MB'].map(t => (
                    <span key={t} className="px-2.5 py-1 bg-dark-bg-secondary border border-dark-border text-dark-text-secondary text-xs rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Flow steps */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Upload,       label: 'Upload Resume',   desc: 'PDF, DOCX, TXT' },
                { icon: Sparkles,     label: 'AI Analysis',     desc: 'Groq powered' },
                { icon: Target,       label: 'Career Profile',  desc: '10-step wizard' },
                { icon: Briefcase,    label: 'Live Jobs',       desc: 'Personalized matches' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-4 bg-dark-card border border-dark-border/50 rounded-xl text-center">
                  <div className="w-8 h-8 bg-dark-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon size={16} className="text-dark-accent" />
                  </div>
                  <p className="text-xs font-bold text-dark-text-primary">{label}</p>
                  <p className="text-[10px] text-dark-text-secondary mt-0.5">{desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-dark-text-secondary/50 pt-2">
              <Lock size={12} />
              <span className="text-xs">Your data is never stored or shared</span>
            </div>
          </>
        )}

        {/* ── LOADING ── */}
        {(status === 'uploading' || status === 'processing') && (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-16 h-16 rounded-full bg-dark-accent/10 flex items-center justify-center">
              <Loader2 size={28} className="text-dark-accent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-dark-text-primary mb-1">
                {status === 'uploading' ? 'Uploading your resume…' : 'AI is analyzing your resume…'}
              </p>
              <p className="text-sm text-dark-text-secondary">Running Groq AI — this takes a few seconds</p>
            </div>
            <div className="w-64 h-1.5 bg-dark-bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-dark-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── FAILED ── */}
        {status === 'failed' && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-dark-text-primary mb-1">Analysis failed</p>
              <p className="text-sm text-dark-text-secondary max-w-sm">{errorMsg}</p>
            </div>
            <button onClick={reset} className="px-5 py-2 bg-dark-accent hover:bg-dark-accent-hover text-white text-sm font-semibold rounded-lg transition-colors">Try again</button>
          </div>
        )}

        {/* ── RESULTS ── */}
        {status === 'completed' && analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-dark-card border border-dark-border/50 rounded-lg flex items-center justify-center">
                  <FileText size={16} className="text-dark-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark-text-primary">{fileName}</p>
                  <p className="text-xs text-green-400">Analysis complete</p>
                </div>
              </div>
              <button onClick={reset} className="w-8 h-8 flex items-center justify-center bg-dark-card border border-dark-border/50 rounded-lg hover:bg-dark-bg-secondary transition-colors">
                <X size={14} className="text-dark-text-secondary" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'ATS Score', value: analysis.atsScore, suffix: '/100' },
                { label: 'Keyword Match', value: analysis.keywords.matchPercentage, suffix: '%' },
              ].map(({ label, value, suffix }) => (
                <div key={label} className="p-5 bg-dark-card border border-dark-border/50 rounded-xl flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#252525" strokeWidth="6" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke={scoreRingColor(value)} strokeWidth="6"
                        strokeDasharray={`${(value / 100) * 163} 163`} strokeLinecap="round" />
                    </svg>
                    <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreColor(value)}`}>{value}</span>
                  </div>
                  <div>
                    <p className="text-xs text-dark-text-secondary mb-0.5">{label}</p>
                    <p className={`text-lg font-bold ${scoreColor(value)}`}>{value}{suffix}</p>
                    <p className="text-xs text-dark-text-secondary">{value >= 80 ? 'Excellent' : value >= 60 ? 'Good' : 'Needs work'}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-dark-card border border-dark-border/50 rounded-xl">
                <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-3">Strengths</p>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-5 bg-dark-card border border-dark-border/50 rounded-xl">
                <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Weaknesses</p>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                      <AlertTriangle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 bg-dark-card border border-dark-border/50 rounded-xl">
              <p className="text-xs font-black text-dark-accent uppercase tracking-widest mb-3">Recommendations</p>
              <ul className="space-y-2">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark-text-secondary">
                    <ChevronRight size={14} className="text-dark-accent flex-shrink-0 mt-0.5" />{r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            {analysis.parsed?.skills && analysis.parsed.skills.length > 0 && (
              <div className="p-5 bg-dark-card border border-dark-border/50 rounded-xl">
                <p className="text-xs font-black text-dark-text-secondary uppercase tracking-widest mb-3">Detected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.parsed.skills.map((s: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 bg-dark-accent/10 border border-dark-accent/20 text-dark-accent text-xs rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA — launch wizard */}
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full py-4 bg-dark-accent hover:bg-dark-accent-hover text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-dark-accent/20 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              Set Up Career Profile & Find Jobs
            </button>

            <button onClick={reset} className="w-full py-3 bg-dark-card border border-dark-border/50 hover:border-dark-accent/40 text-sm text-dark-text-secondary hover:text-dark-text-primary rounded-xl transition-colors">
              Analyze another resume
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default ResumePage
