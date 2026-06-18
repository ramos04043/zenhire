import { API_BASE } from '../lib/api'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Moon, Bell, Lock, Target, Lightbulb, CheckCircle,
  Loader2, AlertCircle, ChevronDown, ChevronUp,
  MapPin, Briefcase, DollarSign, ArrowRight, ExternalLink,
  Search, Zap
} from 'lucide-react'
import { resumeAIService, type AIResumeAnalysis } from '../services/resumeAIService'
import { useOnboardingStore } from '../store/onboardingStore'
import toast from 'react-hot-toast'

// ── Types ─────────────────────────────────────────────────────────────────────
type Stage = 'upload' | 'analyzing' | 'analyzed' | 'preferences' | 'searching' | 'jobs'

interface JobPreferences {
  jobTitle: string
  locations: string
  salaryMin: string
  salaryMax: string
  workMode: 'remote' | 'hybrid' | 'onsite' | 'any'
  employmentType: 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance' | 'any'
  experienceLevel: 'fresher' | '1-3' | '3-5' | '5-8' | '8+' | 'any'
}

interface JobResult {
  id: string
  title: string
  company: string
  location: string
  salary?: string
  summary?: string
  url: string
  source: string
  matchScore: number
  matchingSkills: string[]
  workMode?: string
  employmentType?: string
  postedDate?: string
}

// ── Small components ──────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 80 }: { score: number; size?: number }) => {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f97316' : '#f87171'
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#252525" strokeWidth={7} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  )
}

const Section = ({ title, items, color = 'text-[#f97316]', icon: Icon }: {
  title: string; items: string[]; color?: string; icon: React.ElementType
}) => {
  const [open, setOpen] = useState(true)
  if (!items?.length) return null
  const dotColor = color === 'text-green-400' ? 'bg-green-400' : color === 'text-red-400' ? 'bg-red-400' : color === 'text-yellow-400' ? 'bg-yellow-400' : 'bg-[#f97316]'
  return (
    <div className="bg-[#161616] border border-[#252525] rounded-xl overflow-hidden">
      <button className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a1a] transition-colors" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-3">
          <Icon size={16} className={color} />
          <span className="text-sm font-semibold text-white">{title}</span>
          <span className="text-xs text-[#555] bg-[#1e1e1e] px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        {open ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
      </button>
      {open && (
        <ul className="px-5 pb-4 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#999]">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const sourceBadge = (source: string) => {
  const map: Record<string, string> = {
    Naukri: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Internshala: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    LinkedIn: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    Remotive: 'bg-green-500/10 text-green-400 border-green-500/20',
    Arbeitnow: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  return map[source] || 'bg-[#1e1e1e] text-[#999] border-[#333]'
}

const matchColor = (score: number) =>
  score >= 75 ? 'bg-green-500/10 text-green-400 border-green-500/20'
  : score >= 50 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  : 'bg-red-500/10 text-red-400 border-red-500/20'

// ── Main component ────────────────────────────────────────────────────────────
const ResumeAnalyzer = () => {
  const navigate = useNavigate()
  const { setProfileFromResume, updateProfile } = useOnboardingStore()

  const [stage, setStage] = useState<Stage>('upload')
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AIResumeAnalysis | null>(null)
  const [jobs, setJobs] = useState<JobResult[]>([])
  const [jobSources, setJobSources] = useState<Record<string, number>>({})
  const [filterSource, setFilterSource] = useState('')
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set())

  const [prefs, setPrefs] = useState<JobPreferences>({
    jobTitle: '',
    locations: '',
    salaryMin: '',
    salaryMax: '',
    workMode: 'any',
    employmentType: 'any',
    experienceLevel: 'any',
  })

  // ── Upload & analyze ────────────────────────────────────────────────────────
  const analyze = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase()
    if (!ext.endsWith('.pdf') && !ext.endsWith('.docx') && !ext.endsWith('.txt')) {
      toast.error('Only PDF, DOCX, or TXT files are supported'); return
    }
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10MB'); return }

    setFileName(file.name)
    setStage('analyzing')
    setError(null)

    try {
      toast.loading('Analyzing your resume…', { id: 'analyze' })
      const full = await resumeAIService.analyzeResume(file)
      setProfileFromResume(full)

      const flat: AIResumeAnalysis = {
        atsScore: full.ats_analysis?.score ?? 0,
        summary: full.parsed_data?.summary ?? '',
        skills: full.parsed_data?.skills ?? [],
        experience: full.parsed_data?.experience ?? [],
        education: full.parsed_data?.education ?? [],
        missingKeywords: full.ats_analysis?.keyword_analysis?.missing_skills ?? [],
        strengths: full.ats_analysis?.strengths ?? [],
        weaknesses: full.ats_analysis?.weaknesses ?? [],
        recommendations: full.ats_analysis?.recommendations ?? [],
        jobMatchScore: full.ats_analysis?.keyword_analysis?.match_percentage ?? 0,
      }
      setAnalysis(flat)

      // Pre-fill preferences from parsed resume
      const exp = full.parsed_data?.experience || []
      const currentTitle = exp[0]?.title || ''
      setPrefs(p => ({ ...p, jobTitle: currentTitle || p.jobTitle }))

      setStage('analyzed')
      toast.success('Resume analyzed!', { id: 'analyze' })
    } catch (e: any) {
      const msg = e.message || 'Analysis failed. Make sure the backend is running.'
      setError(msg)
      toast.error(msg, { id: 'analyze' })
      setStage('upload')
    }
  }, [setProfileFromResume])

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    if (e.dataTransfer.files[0]) analyze(e.dataTransfer.files[0])
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) analyze(e.target.files[0])
    e.target.value = ''
  }

  // ── Search jobs ─────────────────────────────────────────────────────────────
  const searchJobs = async () => {
    if (!prefs.jobTitle.trim()) { toast.error('Enter a job title first'); return }

    setStage('searching')
    toast.loading('Searching Naukri, Internshala & more…', { id: 'search' })

    // Save prefs to store
    const locArr = prefs.locations.split(',').map(l => l.trim()).filter(Boolean)
    updateProfile({
      desiredJobTitle: prefs.jobTitle,
      preferredLocations: locArr,
      workMode: prefs.workMode === 'any' ? 'remote' : prefs.workMode as any,
      employmentType: prefs.employmentType === 'any' ? 'full-time' : prefs.employmentType as any,
      experienceLevel: prefs.experienceLevel === 'any' ? undefined : prefs.experienceLevel as any,
      salaryMin: prefs.salaryMin ? parseInt(prefs.salaryMin) : undefined,
      salaryMax: prefs.salaryMax ? parseInt(prefs.salaryMax) : undefined,
    })

    try {
      const resp = await fetch(`${API_BASE}/jobs/search-aggregated`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: prefs.jobTitle.trim(),
          location: locArr[0] || 'India',
          skills: analysis?.skills || [],
          experience_level: prefs.experienceLevel === 'any' ? 'mid' : prefs.experienceLevel,
          work_mode: prefs.workMode === 'any' ? 'remote' : prefs.workMode,
          employment_type: prefs.employmentType === 'any' ? 'full-time' : prefs.employmentType,
          max_results: 50,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Search failed')

      const rawJobs: JobResult[] = (data.jobs || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        location: j.location,
        salary: j.salary,
        summary: j.summary,
        url: j.url,
        source: j.source,
        matchScore: j.matchScore ?? 0,
        matchingSkills: j.matchingSkills ?? [],
        workMode: j.workMode,
        employmentType: j.employmentType,
        postedDate: j.postedDate,
      }))

      const sources: Record<string, number> = {}
      rawJobs.forEach(j => { sources[j.source] = (sources[j.source] || 0) + 1 })

      setJobs(rawJobs)
      setJobSources(sources)
      setStage('jobs')
      toast.success(`Found ${rawJobs.length} jobs from ${Object.keys(sources).length} sources`, { id: 'search' })
    } catch (e: any) {
      toast.error(e.message || 'Search failed', { id: 'search' })
      setStage('preferences')
    }
  }

  const toggleSave = (id: string) => setSavedJobIds(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const getCurrentDate = () =>
    new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const filteredJobs = filterSource ? jobs.filter(j => j.source === filterSource) : jobs

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Nav */}
      <nav className="bg-[#0d0d0d] border-b-2 border-[#f97316] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-white">Resume Analyzer</h1>
            <p className="text-xs text-[#666] mt-0.5">{getCurrentDate()}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Step breadcrumb */}
            <div className="hidden md:flex items-center gap-1 text-xs text-[#555]">
              {(['Upload', 'Analysis', 'Preferences', 'Jobs'] as const).map((s, i) => {
                const stageIdx = ['upload','analyzing','analyzed','preferences','searching','jobs'].indexOf(stage)
                const done = (i === 0 && stageIdx >= 2) || (i === 1 && stageIdx >= 3) || (i === 2 && stageIdx >= 5)
                const active = (i === 0 && stageIdx <= 1) || (i === 1 && stageIdx === 2) || (i === 2 && (stageIdx === 3 || stageIdx === 4)) || (i === 3 && stageIdx === 5)
                return (
                  <span key={s} className={`flex items-center gap-1 ${active ? 'text-[#f97316] font-semibold' : done ? 'text-green-400' : 'text-[#444]'}`}>
                    {i > 0 && <ChevronRight size={12} />}
                    {done && <CheckCircle size={11} />}
                    {s}
                  </span>
                )
              })}
            </div>
            <button className="w-9 h-9 flex items-center justify-center bg-[#161616] border border-[#252525] rounded-lg hover:bg-[#1a1a1a]">
              <Moon size={18} className="text-[#666]" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-[#161616] border border-[#252525] rounded-lg hover:bg-[#1a1a1a]">
              <Bell size={18} className="text-[#666]" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ── UPLOAD / ANALYZING ─────────────────────────────────────────── */}
        {(stage === 'upload' || stage === 'analyzing') && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316]" />
                <span className="text-xs font-medium text-[#f97316]">AI-powered · Find jobs instantly</span>
              </div>
              <h1 className="text-5xl font-medium text-white mb-3">AI Resume Analyzer</h1>
              <p className="text-lg text-[#666] max-w-2xl mx-auto">
                Upload your resume → get ATS score → search Naukri, Internshala & more
              </p>
            </div>

            <div
              className={`mb-10 p-10 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
                isDragging ? 'border-[#f97316] bg-[#f97316]/5' : 'border-[#f97316]/50 bg-[#f97316]/[0.02]'
              } ${stage === 'analyzing' ? 'opacity-60 pointer-events-none' : ''}`}
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f97316]/10 rounded-full mb-5">
                  {stage === 'analyzing'
                    ? <Loader2 size={28} className="text-[#f97316] animate-spin" />
                    : <Upload size={28} className="text-[#f97316]" />
                  }
                </div>
                <h2 className="text-xl font-medium text-white mb-2">
                  {stage === 'analyzing' ? `Analyzing ${fileName}…` : 'Upload Resume'}
                </h2>
                {stage !== 'analyzing' && (
                  <>
                    <p className="text-sm text-[#666] mb-5">Drag & drop or click to browse</p>
                    <label className="inline-block">
                      <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileSelect} />
                      <span className="inline-block px-6 py-2.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                        Choose file
                      </span>
                    </label>
                  </>
                )}
                <div className="flex items-center justify-center gap-2 mt-5">
                  {['PDF', 'DOCX', 'TXT', 'Max 10MB'].map(t => (
                    <span key={t} className="px-2.5 py-1 bg-[#161616] border border-[#252525] text-[#666] text-xs rounded">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Target, title: 'ATS Score', desc: 'Pass applicant tracking systems' },
                { icon: Lightbulb, title: 'Skills Gap', desc: 'Find missing skills' },
                { icon: CheckCircle, title: 'Clarity Check', desc: 'Readability feedback' },
                { icon: Search, title: 'Job Search', desc: 'Naukri · Internshala · more' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 bg-[#161616] border border-[#252525] rounded-xl flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center bg-[#f97316]/10 rounded-lg flex-shrink-0">
                    <Icon size={18} className="text-[#f97316]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{title}</p>
                    <p className="text-xs text-[#666] mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ANALYSIS RESULTS ──────────────────────────────────────────── */}
        {stage === 'analyzed' && analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Resume Analysis</h2>
                <p className="text-sm text-[#666] mt-0.5">{fileName}</p>
              </div>
              <button onClick={() => setStage('preferences')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-[#f97316]/20">
                Find Jobs <ArrowRight size={16} />
              </button>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-[#161616] border border-[#252525] rounded-xl flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={analysis.atsScore} />
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold"
                    style={{ color: analysis.atsScore >= 80 ? '#4ade80' : analysis.atsScore >= 60 ? '#f97316' : '#f87171' }}>
                    {analysis.atsScore}
                  </span>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">ATS Score</p>
                  <p className="text-xs text-[#666] mt-0.5">
                    {analysis.atsScore >= 80 ? 'Excellent — strong ATS compatibility' : analysis.atsScore >= 60 ? 'Good — some improvements recommended' : 'Needs work — significant gaps found'}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-[#161616] border border-[#252525] rounded-xl flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={analysis.jobMatchScore} />
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold"
                    style={{ color: analysis.jobMatchScore >= 80 ? '#4ade80' : analysis.jobMatchScore >= 60 ? '#f97316' : '#f87171' }}>
                    {analysis.jobMatchScore}%
                  </span>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Keyword Match</p>
                  <p className="text-xs text-[#666] mt-0.5">Keyword alignment with job market</p>
                </div>
              </div>
            </div>

            {analysis.summary && (
              <div className="p-5 bg-[#161616] border border-[#252525] rounded-xl">
                <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-2">Summary</p>
                <p className="text-sm text-[#999] leading-relaxed">{analysis.summary}</p>
              </div>
            )}

            {analysis.skills.length > 0 && (
              <div className="p-5 bg-[#161616] border border-[#252525] rounded-xl">
                <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-3">Detected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Strengths" items={analysis.strengths} color="text-green-400" icon={CheckCircle} />
              <Section title="Weaknesses" items={analysis.weaknesses} color="text-red-400" icon={AlertCircle} />
              <Section title="Recommendations" items={analysis.recommendations} color="text-[#f97316]" icon={Lightbulb} />
              <Section title="Missing Keywords" items={analysis.missingKeywords} color="text-yellow-400" icon={Target} />
            </div>

            {analysis.experience.length > 0 && (
              <div className="p-5 bg-[#161616] border border-[#252525] rounded-xl">
                <p className="text-xs font-bold text-[#f97316] uppercase tracking-widest mb-4">Experience</p>
                <div className="space-y-3">
                  {analysis.experience.map((exp: any, i: number) => (
                    <div key={i} className="border-l-2 border-[#f97316]/30 pl-4">
                      <p className="text-sm font-semibold text-white">{exp.title}</p>
                      <p className="text-xs text-[#f97316]">{exp.company}{exp.duration ? ` · ${exp.duration}` : ''}</p>
                      {exp.description && <p className="text-xs text-[#666] mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-5 bg-[#f97316]/5 border border-[#f97316]/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">Ready to find matching jobs?</p>
                <p className="text-xs text-[#999]">Search Naukri, Internshala, and 8 more sources based on your resume</p>
              </div>
              <button onClick={() => setStage('preferences')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl font-semibold text-sm transition-all flex-shrink-0">
                Find Jobs <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── PREFERENCES FORM ───────────────────────────────────────────── */}
        {stage === 'preferences' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => setStage('analyzed')} className="text-[#555] hover:text-white transition-colors">
                <ChevronLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">Job Preferences</h2>
                <p className="text-sm text-[#666] mt-0.5">Tell us what you're looking for — we'll search Naukri, Internshala & more</p>
              </div>
            </div>

            <div className="bg-[#161616] border border-[#252525] rounded-2xl p-6 space-y-5">
              {/* Job title */}
              <div>
                <label className="block text-sm font-medium text-[#999] mb-2">
                  <Briefcase size={14} className="inline mr-1.5 text-[#f97316]" />
                  Desired Job Title <span className="text-red-400">*</span>
                </label>
                <input
                  value={prefs.jobTitle}
                  onChange={e => setPrefs(p => ({ ...p, jobTitle: e.target.value }))}
                  placeholder="e.g., Frontend Developer, Data Analyst"
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>

              {/* Preferred locations */}
              <div>
                <label className="block text-sm font-medium text-[#999] mb-2">
                  <MapPin size={14} className="inline mr-1.5 text-[#f97316]" />
                  Preferred Locations
                </label>
                <input
                  value={prefs.locations}
                  onChange={e => setPrefs(p => ({ ...p, locations: e.target.value }))}
                  placeholder="e.g., Bangalore, Mumbai, Remote (comma separated)"
                  className="w-full px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:border-[#f97316] focus:outline-none"
                />
              </div>

              {/* Salary range */}
              <div>
                <label className="block text-sm font-medium text-[#999] mb-2">
                  <DollarSign size={14} className="inline mr-1.5 text-[#f97316]" />
                  Expected Salary Range (₹ per year, optional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={prefs.salaryMin}
                    onChange={e => setPrefs(p => ({ ...p, salaryMin: e.target.value }))}
                    placeholder="Min (e.g. 500000)"
                    className="px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:border-[#f97316] focus:outline-none"
                  />
                  <input
                    type="number"
                    value={prefs.salaryMax}
                    onChange={e => setPrefs(p => ({ ...p, salaryMax: e.target.value }))}
                    placeholder="Max (e.g. 1500000)"
                    className="px-4 py-2.5 bg-[#1a1a1a] border border-[#333] rounded-lg text-white text-sm focus:border-[#f97316] focus:outline-none"
                  />
                </div>
              </div>

              {/* Work mode */}
              <div>
                <label className="block text-sm font-medium text-[#999] mb-2">Work Mode</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['any', 'remote', 'hybrid', 'onsite'] as const).map(m => (
                    <button key={m} onClick={() => setPrefs(p => ({ ...p, workMode: m }))}
                      className={`py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${prefs.workMode === m ? 'bg-[#f97316] text-white' : 'bg-[#1a1a1a] text-[#666] border border-[#333] hover:border-[#555]'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Employment type */}
              <div>
                <label className="block text-sm font-medium text-[#999] mb-2">Employment Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['any', 'full-time', 'internship', 'part-time', 'contract', 'freelance'] as Array<JobPreferences['employmentType']>).map(t => (
                    <button key={t} onClick={() => setPrefs(p => ({ ...p, employmentType: t }))}
                      className={`py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${prefs.employmentType === t ? 'bg-[#f97316] text-white' : 'bg-[#1a1a1a] text-[#666] border border-[#333] hover:border-[#555]'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience level */}
              <div>
                <label className="block text-sm font-medium text-[#999] mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {([['any','Any'], ['fresher','Fresher'], ['1-3','1-3 yrs'], ['3-5','3-5 yrs'], ['5-8','5-8 yrs'], ['8+','8+ yrs']] as const).map(([val, label]) => (
                    <button key={val} onClick={() => setPrefs(p => ({ ...p, experienceLevel: val }))}
                      className={`py-2 rounded-lg text-xs font-semibold transition-colors ${prefs.experienceLevel === val ? 'bg-[#f97316] text-white' : 'bg-[#1a1a1a] text-[#666] border border-[#333] hover:border-[#555]'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={searchJobs} disabled={!prefs.jobTitle.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#f97316] hover:bg-[#ea6a0f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#f97316]/20">
                <Search size={18} /> Search Jobs
              </button>
            </div>
          </div>
        )}

        {/* ── SEARCHING ──────────────────────────────────────────────────── */}
        {stage === 'searching' && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-[#f97316]/20 border-t-[#f97316] animate-spin" />
              <Search size={28} className="absolute inset-0 m-auto text-[#f97316]" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white mb-1">Searching across platforms…</p>
              <p className="text-sm text-[#666]">Naukri · Internshala · Remotive · Greenhouse · 6 more sources</p>
            </div>
            <div className="flex gap-2 mt-2">
              {['Naukri', 'Internshala', 'Remotive', 'Greenhouse', 'Lever'].map(s => (
                <span key={s} className="px-3 py-1 bg-[#161616] border border-[#252525] text-[#555] text-xs rounded-full animate-pulse">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── JOB RESULTS ────────────────────────────────────────────────── */}
        {stage === 'jobs' && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {jobs.length} Jobs Found
                  <span className="text-base font-normal text-[#666] ml-2">for "{prefs.jobTitle}"</span>
                </h2>
                <p className="text-sm text-[#555] mt-0.5">
                  {prefs.locations && `📍 ${prefs.locations} · `}
                  {Object.keys(jobSources).length} sources
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setStage('preferences')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#161616] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-xl text-sm transition-colors">
                  <Search size={14} /> Refine
                </button>
                <button onClick={() => { setStage('upload'); setJobs([]); setAnalysis(null) }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#161616] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-xl text-sm transition-colors">
                  <Upload size={14} /> New Resume
                </button>
                <button onClick={() => navigate('/jobs')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl text-sm font-semibold transition-colors">
                  View All Jobs <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Source filter pills */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setFilterSource('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!filterSource ? 'bg-[#f97316] text-white' : 'bg-[#161616] text-[#666] border border-[#252525] hover:border-[#444]'}`}>
                All ({jobs.length})
              </button>
              {Object.entries(jobSources).sort((a, b) => b[1] - a[1]).map(([source, count]) => (
                <button key={source} onClick={() => setFilterSource(filterSource === source ? '' : source)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${filterSource === source ? `${sourceBadge(source)} opacity-100` : `bg-[#161616] text-[#666] border-[#252525] hover:border-[#444]`}`}>
                  {source} ({count})
                </button>
              ))}
            </div>

            {/* Job cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map(job => (
                <div key={job.id} className="bg-[#161616] border border-[#252525] hover:border-[#f97316]/20 rounded-xl p-5 transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sourceBadge(job.source)}`}>{job.source}</span>
                        {job.salary && <span className="text-xs text-green-400 font-semibold">{job.salary}</span>}
                        {job.postedDate && <span className="text-[10px] text-[#555]">{job.postedDate}</span>}
                      </div>
                      <h3 className="text-sm font-bold text-white truncate">{job.title}</h3>
                      <p className="text-xs text-[#f97316] font-semibold mt-0.5">{job.company}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={11} className="text-[#555]" />
                        <span className="text-xs text-[#555]">{job.location}</span>
                      </div>
                    </div>
                    <div className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 border rounded-full ${matchColor(job.matchScore)}`}>
                      <Zap size={10} strokeWidth={3} />
                      <span className="text-[10px] font-black">{job.matchScore}%</span>
                    </div>
                  </div>

                  {job.summary && <p className="text-xs text-[#666] line-clamp-2 mb-3">{job.summary}</p>}

                  {job.matchingSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.matchingSkills.slice(0, 4).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold rounded">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-[#252525]">
                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#f97316] hover:bg-[#ea6a0f] text-white text-xs font-bold rounded-lg transition-all">
                        <ExternalLink size={12} /> Apply Now
                      </a>
                    ) : (
                      <button className="flex-1 py-2 bg-[#f97316]/20 text-[#f97316] text-xs font-bold rounded-lg cursor-not-allowed opacity-60">No Link</button>
                    )}
                    <button onClick={() => toggleSave(job.id)}
                      className={`p-2 rounded-lg border transition-all text-xs font-bold ${savedJobIds.has(job.id) ? 'bg-[#f97316]/10 border-[#f97316]/30 text-[#f97316]' : 'bg-[#1a1a1a] border-[#333] text-[#555] hover:text-[#f97316]'}`}>
                      {savedJobIds.has(job.id) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[#555]">No jobs match the selected filter</p>
                <button onClick={() => setFilterSource('')} className="mt-2 text-sm text-[#f97316] hover:underline">Clear filter</button>
              </div>
            )}

            <div className="border-t border-[#252525] pt-6 flex items-center justify-center gap-2 text-[#555]">
              <Lock size={14} />
              <span className="text-xs">Your resume data is never stored or shared</span>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

// Missing icon used in nav breadcrumb
function ChevronRight({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function ChevronLeft({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function Upload({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

export default ResumeAnalyzer
