import { API_BASE } from '../lib/api'
import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import {
  FileText, Sparkles, Download, Copy, RefreshCw,
  AlertCircle, Loader2, CheckCircle, Briefcase
} from 'lucide-react'
import { useOnboardingStore } from '../store/onboardingStore'
import toast from 'react-hot-toast'

type Tone = 'professional' | 'enthusiastic' | 'concise'

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Polished & formal' },
  { id: 'enthusiastic', label: 'Enthusiastic', desc: 'Energetic & eager' },
  { id: 'concise',      label: 'Concise',      desc: 'Short & punchy' },
]

const I = 'w-full px-3 py-2.5 bg-[#0d0d0d] border border-[#252525] rounded-lg text-sm text-white focus:border-[#f97316]/50 focus:outline-none placeholder-[#444]'
const L = 'block text-xs font-semibold text-[#555] uppercase tracking-wider mb-1.5'

const CoverLetterGenerator = () => {
  const { profile } = useOnboardingStore()

  const [company, setCompany]               = useState('')
  const [position, setPosition]             = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [tone, setTone]                     = useState<Tone>('professional')
  const [generating, setGenerating]         = useState(false)
  const [coverLetter, setCoverLetter]       = useState('')
  const [subjectLine, setSubjectLine]       = useState('')
  const [wordCount, setWordCount]           = useState(0)
  const [copied, setCopied]                 = useState(false)
  const [error, setError]                   = useState('')

  const generate = async () => {
    if (!company.trim() || !position.trim()) {
      toast.error('Enter company and position first')
      return
    }
    setGenerating(true)
    setError('')
    setCoverLetter('')
    toast.loading('Writing your cover letter…', { id: 'cl' })
    try {
      const resp = await fetch(`${API_BASE}/cover-letter/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: company.trim(),
          position: position.trim(),
          job_description: jobDescription.trim(),
          tone,
          candidate_name: profile.fullName || '',
          candidate_skills: profile.skills || [],
          resume_summary: profile.resumeSummary || '',
          experience: profile.currentJobTitle
            ? [{ title: profile.currentJobTitle, company: profile.previousCompanies?.[0] || '', duration: '' }]
            : [],
        }),
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Generation failed')
      setCoverLetter(data.cover_letter)
      setSubjectLine(data.subject_line)
      setWordCount(data.word_count)
      toast.success('Cover letter ready!', { id: 'cl' })
    } catch (e: any) {
      setError(e.message || 'Failed. Make sure the backend is running.')
      toast.error(e.message, { id: 'cl' })
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!coverLetter) return
    await navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadTXT = () => {
    if (!coverLetter) return
    const blob = new Blob([`${subjectLine}\n\n${coverLetter}`], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `cover_letter_${company.toLowerCase().replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded')
  }

  const handleDownloadHTML = () => {
    if (!coverLetter) return
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<title>Cover Letter — ${position} at ${company}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:10.5pt;color:#1a1a1a;max-width:680px;margin:48px auto;padding:0 28px;line-height:1.8}
  .subject{font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#e84e1b;border-bottom:1.5px solid #e84e1b;padding-bottom:6px;margin-bottom:24px}
  p{margin-bottom:1em}
  @media print{body{margin:20px}}
</style></head><body>
<div class="subject">${subjectLine}</div>
${coverLetter.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('\n')}
</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `cover_letter_${company.toLowerCase().replace(/\s+/g, '_')}.html`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded as HTML')
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-[#f97316]" />
          <div>
            <h1 className="text-xl font-bold text-white">Cover Letter Generator</h1>
            <p className="text-xs text-[#555]">
              AI-written, personalised to your resume and the job
              {profile.resumeAnalyzed && (
                <span className="ml-2 text-green-400 font-semibold">✓ Resume loaded</span>
              )}
            </p>
          </div>
        </div>

        {/* Main two-column layout */}
        <div className="grid grid-cols-3 gap-5">

          {/* ── Left: generated letter ── */}
          <div className="col-span-2 bg-[#161616] border border-[#252525] rounded-xl p-5 flex flex-col">

            {/* Letter header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#f97316]" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Generated Letter</span>
                {wordCount > 0 && (
                  <span className="text-[10px] text-[#444] bg-[#1a1a1a] px-2 py-0.5 rounded-full border border-[#252525]">
                    {wordCount} words
                  </span>
                )}
              </div>
              {coverLetter && (
                <div className="flex gap-2">
                  <button onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    {copied ? <CheckCircle size={12} className="text-green-400" /> : <Copy size={12} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownloadTXT}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-lg text-xs font-semibold transition-colors">
                    <Download size={12} /> TXT
                  </button>
                  <button onClick={handleDownloadHTML}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-lg text-xs font-bold transition-colors">
                    <Download size={12} /> HTML
                  </button>
                  <button onClick={generate} disabled={generating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/40 text-[#999] hover:text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-40">
                    <RefreshCw size={12} className={generating ? 'animate-spin' : ''} /> Regenerate
                  </button>
                </div>
              )}
            </div>

            {/* Subject line */}
            {subjectLine && (
              <div className="mb-3 px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-wider flex-shrink-0">Subject</span>
                <span className="text-xs text-[#ccc]">{subjectLine}</span>
              </div>
            )}

            {/* Letter body */}
            <div className="flex-1 bg-[#0d0d0d] border border-[#252525] rounded-xl p-6 min-h-[420px]">
              {generating ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[360px] gap-3">
                  <Loader2 size={32} className="text-[#f97316] animate-spin" />
                  <p className="text-[#555] text-sm">AI is writing your cover letter…</p>
                </div>
              ) : error ? (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-1">Generation failed</p>
                    <p className="text-xs text-red-400/70">{error}</p>
                  </div>
                </div>
              ) : coverLetter ? (
                <div className="space-y-4">
                  {coverLetter.split('\n').filter(l => l.trim()).map((para, i) => (
                    <p key={i} className="text-sm text-[#ccc] leading-relaxed">{para}</p>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[360px] gap-3 text-center">
                  <div className="w-12 h-12 bg-[#f97316]/10 rounded-xl flex items-center justify-center">
                    <FileText size={22} className="text-[#f97316]/50" />
                  </div>
                  <p className="text-[#444] text-sm">
                    Fill in the job details and click{' '}
                    <span className="text-[#f97316] font-semibold">Generate</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="space-y-4">

            {/* Job details card */}
            <div className="bg-[#161616] border border-[#252525] rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={14} className="text-[#f97316]" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Job Details</span>
              </div>

              <div>
                <label className={L}>Company <span className="text-red-400 normal-case font-normal">*</span></label>
                <input value={company} onChange={e => setCompany(e.target.value)}
                  placeholder="e.g., Google" className={I} />
              </div>

              <div>
                <label className={L}>Position <span className="text-red-400 normal-case font-normal">*</span></label>
                <input value={position} onChange={e => setPosition(e.target.value)}
                  placeholder="e.g., Software Engineer" className={I} />
              </div>

              <div>
                <label className={L}>
                  Job Description
                  <span className="ml-1 text-[#333] normal-case font-normal">(optional but recommended)</span>
                </label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                  placeholder="Paste the job description for a more tailored letter…"
                  rows={5} className={I + ' resize-none'} />
              </div>

              {/* Tone selector */}
              <div>
                <label className={L}>Tone</label>
                <div className="space-y-2">
                  {TONES.map(t => (
                    <button key={t.id} onClick={() => setTone(t.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition-all ${
                        tone === t.id
                          ? 'border-[#f97316]/50 bg-[#f97316]/5'
                          : 'border-[#252525] bg-[#0d0d0d] hover:border-[#333]'
                      }`}>
                      <div>
                        <span className={`text-xs font-semibold ${tone === t.id ? 'text-[#f97316]' : 'text-white'}`}>
                          {t.label}
                        </span>
                        <span className="text-[10px] text-[#555] ml-2">{t.desc}</span>
                      </div>
                      {tone === t.id && (
                        <div className="w-3.5 h-3.5 rounded-full bg-[#f97316] flex items-center justify-center flex-shrink-0">
                          <CheckCircle size={9} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generate} disabled={generating || !company.trim() || !position.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#f97316] hover:bg-[#ea6a0f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#f97316]/20">
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {generating ? 'Generating…' : 'Generate Cover Letter'}
              </button>
            </div>

            {/* Resume data status */}
            {profile.resumeAnalyzed ? (
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="text-xs font-semibold text-green-400">Resume data loaded</span>
                </div>
                <p className="text-[10px] text-[#555] mb-2 leading-relaxed">
                  Your skills and experience will be used to personalise the letter.
                </p>
                {profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.slice(0, 5).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">
                        {s}
                      </span>
                    ))}
                    {profile.skills.length > 5 && (
                      <span className="text-[10px] text-[#444]">+{profile.skills.length - 5} more</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-[#f97316]/5 border border-[#f97316]/20 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={14} className="text-[#f97316]" />
                  <span className="text-xs font-semibold text-[#f97316]">No resume data</span>
                </div>
                <p className="text-[10px] text-[#555] leading-relaxed">
                  Analyse your resume first for a more personalised letter. You can still generate without it.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CoverLetterGenerator
