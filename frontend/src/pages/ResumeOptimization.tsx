import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, ChevronRight, Download, Trash2, Eye,
  CheckCircle, XCircle, Plus, Minus, ArrowRight,
  FileText, Clock, X, Edit3, Wand2, LayoutTemplate,
  User, Briefcase, GraduationCap, Code, Copy
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useOptimizationStore } from '../store/optimizationStore'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import { resumeOptimizationService } from '../services/resumeOptimizationService'
import {
  generateResumeHTML, downloadAsPDF, TEMPLATE_META,
  type ResumeData, type TemplateId
} from '../utils/resumeTemplates'
import toast from 'react-hot-toast'

type MainTab = 'builder' | 'ai' | 'history'

// ── ATS score estimator (live) ─────────────────────────────────────────────────
const estimateATS = (r: ResumeData): number => {
  let s = 30
  if (r.name) s += 5
  if (r.email) s += 5
  if (r.phone) s += 5
  if (r.summary?.length > 50) s += 10
  s += Math.min(r.experience.filter(e => e.title && e.company).length * 8, 20)
  s += Math.min(r.skills.filter(Boolean).length * 2, 10)
  if (r.education.some(e => e.degree)) s += 5
  if (r.experience.some(e => e.description?.length > 30)) s += 10
  return Math.min(s, 98)
}

// ── Score ring ─────────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 72 }: { score: number; size?: number }) => {
  const r = size / 2 - 7
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#f97316' : '#f87171'
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#252525" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
    </svg>
  )
}

export default function ResumeOptimization() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { profile } = useOnboardingStore()
  const { currentResult, currentJob, versions, setVersions, removeVersion } = useOptimizationStore()

  const [mainTab, setMainTab] = useState<MainTab>('builder')
  const [template, setTemplate] = useState<TemplateId>('ats-pro')
  const [previewMode, setPreviewMode] = useState(false)
  const [aiSection, setAiSection] = useState<string | null>('summary')
  const [previewVersion, setPreviewVersion] = useState<any | null>(null)

  const [rd, setRd] = useState<ResumeData>(() => ({
    name: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.preferredLocations?.[0] || '',
    linkedin: '',
    summary: profile.resumeSummary || '',
    experience: profile.currentJobTitle
      ? [{ title: profile.currentJobTitle, company: profile.previousCompanies?.[0] || '', duration: '', description: '' }]
      : [{ title: '', company: '', duration: '', description: '' }],
    education: profile.education?.length
      ? profile.education.map((e: any) => ({ degree: e.degree || '', institution: e.institution || '', year: e.year || '' }))
      : [{ degree: '', institution: '', year: '' }],
    skills: profile.skills?.length ? [...profile.skills] : [''],
    projects: [],
    certifications: profile.certifications || [],
  }))

  const atsScore = estimateATS(rd)

  useEffect(() => { if (user?.id) resumeOptimizationService.getVersions(user.id).then(setVersions) }, [user?.id])

  useEffect(() => {
    if (profile.resumeAnalyzed) {
      setRd(p => ({
        ...p,
        name: p.name || profile.fullName || '',
        email: p.email || profile.email || '',
        phone: p.phone || profile.phone || '',
        summary: p.summary || profile.resumeSummary || '',
        skills: p.skills.some(Boolean) ? p.skills : (profile.skills?.length ? [...profile.skills] : ['']),
      }))
    }
  }, [profile.resumeAnalyzed])

  // ── field helpers ──────────────────────────────────────────────────────────
  const upd = (field: keyof ResumeData, val: any) => setRd(p => ({ ...p, [field]: val }))
  const updExp = (i: number, f: string, v: string) => setRd(p => { const a = [...p.experience]; a[i] = { ...a[i], [f]: v }; return { ...p, experience: a } })
  const updEdu = (i: number, f: string, v: string) => setRd(p => { const a = [...p.education]; a[i] = { ...a[i], [f]: v }; return { ...p, education: a } })
  const updProj = (i: number, f: string, v: string) => setRd(p => { const a = [...p.projects]; a[i] = { ...a[i], [f]: v }; return { ...p, projects: a } })
  const updSkill = (i: number, v: string) => setRd(p => { const a = [...p.skills]; a[i] = v; return { ...p, skills: a } })

  // ── downloads ──────────────────────────────────────────────────────────────
  const handlePDF = () => {
    downloadAsPDF(rd, template)
    toast.success('Browser print dialog opened — choose "Save as PDF"')
  }
  const handleCopy = async () => {
    const text = `${rd.name}\n${[rd.email,rd.phone,rd.location].filter(Boolean).join(' | ')}\n\n${rd.summary}`
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }
  const handleDelete = async (id: number) => {
    if (!user?.id) return
    await resumeOptimizationService.deleteVersion(user.id, id)
    removeVersion(id)
    toast.success('Deleted')
  }

  const I = "w-full px-3 py-2 bg-[#0d0d0d] border border-[#252525] rounded-lg text-sm text-white focus:border-[#f97316]/50 focus:outline-none placeholder-[#444]"
  const L = "block text-xs font-semibold text-[#555] mb-1 uppercase tracking-wider"
  const S = "p-4 bg-[#0d0d0d] border border-[#252525] rounded-xl space-y-3"

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#f97316]" />
            <div>
              <h1 className="text-xl font-bold text-white">Resume Optimizer</h1>
              <p className="text-xs text-[#555]">Build manually or let AI optimize for a job</p>
            </div>
          </div>
          <button onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-[#161616] border border-[#252525] hover:border-[#f97316]/30 text-[#999] hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5">
            <ArrowRight size={13} /> Jobs
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#1e1e1e]">
          {([
            { id: 'builder', label: 'Resume Builder', icon: Edit3 },
            { id: 'ai',      label: 'AI Optimizer',   icon: Wand2 },
            { id: 'history', label: `History (${versions.length})`, icon: Clock },
          ] as { id: MainTab; label: string; icon: React.ElementType }[]).map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-all ${mainTab === t.id ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-[#555] hover:text-[#999]'}`}>
              <t.icon size={13} />{t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ═══ BUILDER TAB ═══ */}
          {mainTab === 'builder' && (
            <motion.div key="builder" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* Template picker */}
              <div className="p-5 bg-[#161616] border border-[#252525] rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutTemplate size={14} className="text-[#f97316]" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Choose Template</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {(Object.entries(TEMPLATE_META) as [TemplateId, typeof TEMPLATE_META[TemplateId]][]).map(([key, t]) => (
                    <button key={key} onClick={() => setTemplate(key)}
                      className={`relative p-3 rounded-xl border text-left transition-all ${template === key ? 'border-[#f97316] bg-[#f97316]/5' : 'border-[#252525] hover:border-[#333] bg-[#0d0d0d]'}`}>
                      {/* Mini preview mockup */}
                      <div className="h-14 rounded-lg mb-2 overflow-hidden border border-[#1a1a1a]"
                        style={{ background: key === 'executive' ? '#1c2b3a' : '#fff' }}>
                        {key === 'executive' && <div className="flex h-full"><div className="w-1/3 h-full" style={{ background: '#1c2b3a' }} /><div className="flex-1 p-1.5 space-y-1 bg-white"><div className="h-1.5 bg-gray-400 rounded w-3/4" /><div className="h-1 bg-gray-200 rounded w-1/2" /><div className="h-0.5 bg-orange-200 rounded w-full mt-1" /><div className="h-1 bg-gray-200 rounded w-full" /><div className="h-1 bg-gray-200 rounded w-4/5" /></div></div>}
                        {key === 'modern' && <div className="p-1.5 space-y-1"><div className="flex items-center gap-1"><div className="w-1 h-5 rounded" style={{ background: '#e84e1b' }} /><div className="h-2 bg-gray-700 rounded w-3/4" /></div><div className="h-0.5 rounded w-full" style={{ background: '#f5c4b8' }} /><div className="h-1 bg-gray-300 rounded w-full" /><div className="flex gap-1 mt-1">{[...Array(3)].map((_,i)=><div key={i} className="h-2 rounded-full w-8" style={{ background: '#fff5f2', border: '1px solid #f5c4b8' }}/>)}</div></div>}
                        {key === 'minimal' && <div className="p-1.5 space-y-1 text-center"><div className="h-2.5 bg-gray-700 rounded mx-auto w-2/3" /><div className="h-0.5 bg-gray-700 rounded w-full" /><div className="h-1 bg-gray-300 rounded w-3/4 mx-auto" /><div className="h-1 bg-gray-200 rounded w-4/5 mx-auto" /></div>}
                        {key === 'ats-pro' && <div className="p-1.5 space-y-1"><div className="h-2 bg-gray-700 rounded w-2/3" /><div className="h-0.5 bg-gray-800 rounded w-full" /><div className="h-1.5 bg-gray-600 rounded w-1/3 mt-1" /><div className="h-1 bg-gray-300 rounded w-full" /><div className="h-1.5 bg-gray-600 rounded w-1/3 mt-1" /><div className="h-1 bg-gray-300 rounded w-4/5" /></div>}
                      </div>
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-xs font-bold ${template === key ? 'text-[#f97316]' : 'text-white'}`}>{t.name}</p>
                        <span className="text-[9px] font-bold text-green-400">{t.ats}% ATS</span>
                      </div>
                      <p className="text-[10px] text-[#555] leading-tight">{t.desc}</p>
                      {template === key && <div className="absolute top-2 right-2 w-4 h-4 bg-[#f97316] rounded-full flex items-center justify-center"><CheckCircle size={10} className="text-white" /></div>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live ATS bar */}
              <div className="p-4 bg-[#161616] border border-[#252525] rounded-xl flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={atsScore} size={60} />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: atsScore >= 80 ? '#4ade80' : atsScore >= 60 ? '#f97316' : '#f87171' }}>{atsScore}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1"><span className="text-sm font-bold text-white">Live ATS Score</span><span className="text-xs text-[#555]">Updates as you type</span></div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${atsScore}%`, backgroundColor: atsScore >= 80 ? '#4ade80' : atsScore >= 60 ? '#f97316' : '#f87171' }} />
                  </div>
                  <p className="text-xs text-[#555] mt-1">{atsScore < 50 ? 'Add name, email, experience and skills first' : atsScore < 70 ? 'Good start — add summary and experience details' : atsScore < 85 ? 'Strong — quantify achievements to push higher' : 'Excellent ATS compatibility!'}</p>
                </div>
                <button onClick={() => setPreviewMode(p => !p)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 flex-shrink-0 transition-colors ${previewMode ? 'bg-[#f97316] text-white' : 'bg-[#1a1a1a] border border-[#252525] text-[#999] hover:text-white'}`}>
                  <Eye size={13} />{previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>

              {/* Two-panel layout */}
              <div className={`grid gap-5 ${previewMode ? 'grid-cols-1' : 'grid-cols-2'}`}>

                {/* Edit panel */}
                {!previewMode && (
                  <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">

                    {/* Personal info */}
                    <div className={S}>
                      <div className="flex items-center gap-2 mb-1"><User size={13} className="text-[#f97316]" /><span className="text-xs font-bold text-white uppercase tracking-wider">Personal Info</span></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className={L}>Full Name</label><input value={rd.name} onChange={e => upd('name', e.target.value)} placeholder="Pawan Kumar" className={I} /></div>
                        <div><label className={L}>Email</label><input value={rd.email} onChange={e => upd('email', e.target.value)} placeholder="you@email.com" className={I} /></div>
                        <div><label className={L}>Phone</label><input value={rd.phone} onChange={e => upd('phone', e.target.value)} placeholder="+91 98765 43210" className={I} /></div>
                        <div><label className={L}>Location</label><input value={rd.location} onChange={e => upd('location', e.target.value)} placeholder="Bangalore, India" className={I} /></div>
                        <div className="col-span-2"><label className={L}>LinkedIn</label><input value={rd.linkedin} onChange={e => upd('linkedin', e.target.value)} placeholder="linkedin.com/in/your-profile" className={I} /></div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className={S}>
                      <div className="flex items-center gap-2 mb-1"><FileText size={13} className="text-[#f97316]" /><span className="text-xs font-bold text-white uppercase tracking-wider">Professional Summary</span></div>
                      <textarea value={rd.summary} onChange={e => upd('summary', e.target.value)} placeholder="2-3 sentences: your experience, key skills, and career goal." rows={4} className={I + ' resize-none'} />
                      <p className="text-[10px] text-[#444]">{rd.summary.length}/500 chars</p>
                    </div>

                    {/* Skills */}
                    <div className={S}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Code size={13} className="text-[#f97316]" /><span className="text-xs font-bold text-white uppercase tracking-wider">Skills</span></div>
                        <button onClick={() => setRd(p => ({ ...p, skills: [...p.skills, ''] }))} className="text-[10px] text-[#f97316] font-bold flex items-center gap-1"><Plus size={11} />Add</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rd.skills.map((s, i) => (
                          <div key={i} className="flex items-center gap-1 bg-[#1a1a1a] border border-[#252525] rounded-lg px-2 py-1">
                            <input value={s} onChange={e => updSkill(i, e.target.value)} placeholder="e.g. Python" className="bg-transparent text-xs text-white w-20 focus:outline-none" />
                            {rd.skills.length > 1 && <button onClick={() => setRd(p => ({ ...p, skills: p.skills.filter((_, j) => j !== i) }))} className="text-[#444] hover:text-red-400"><X size={10} /></button>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className={S}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Briefcase size={13} className="text-[#f97316]" /><span className="text-xs font-bold text-white uppercase tracking-wider">Experience</span></div>
                        <button onClick={() => setRd(p => ({ ...p, experience: [...p.experience, { title:'', company:'', duration:'', description:'' }] }))} className="text-[10px] text-[#f97316] font-bold flex items-center gap-1"><Plus size={11} />Add Role</button>
                      </div>
                      {rd.experience.map((exp, i) => (
                        <div key={i} className="space-y-2 pt-3 border-t border-[#1a1a1a] first:border-t-0 first:pt-0">
                          <div className="flex justify-between items-center"><p className="text-[10px] text-[#555] font-bold uppercase">Role {i+1}</p>{i > 0 && <button onClick={() => setRd(p => ({ ...p, experience: p.experience.filter((_,j)=>j!==i) }))} className="text-[#444] hover:text-red-400"><X size={12} /></button>}</div>
                          <input value={exp.title} onChange={e => updExp(i,'title',e.target.value)} placeholder="Job Title" className={I} />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={exp.company} onChange={e => updExp(i,'company',e.target.value)} placeholder="Company Name" className={I} />
                            <input value={exp.duration} onChange={e => updExp(i,'duration',e.target.value)} placeholder="Jan 2023 – Present" className={I} />
                          </div>
                          <textarea value={exp.description} onChange={e => updExp(i,'description',e.target.value)} placeholder="Key responsibilities. Use action verbs: Built, Led, Improved..." rows={3} className={I + ' resize-none'} />
                        </div>
                      ))}
                    </div>

                    {/* Education */}
                    <div className={S}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><GraduationCap size={13} className="text-[#f97316]" /><span className="text-xs font-bold text-white uppercase tracking-wider">Education</span></div>
                        <button onClick={() => setRd(p => ({ ...p, education: [...p.education, { degree:'', institution:'', year:'' }] }))} className="text-[10px] text-[#f97316] font-bold flex items-center gap-1"><Plus size={11} />Add</button>
                      </div>
                      {rd.education.map((edu, i) => (
                        <div key={i} className="space-y-2 pt-3 border-t border-[#1a1a1a] first:border-t-0 first:pt-0">
                          <div className="flex justify-between items-center"><p className="text-[10px] text-[#555] font-bold uppercase">Degree {i+1}</p>{i > 0 && <button onClick={() => setRd(p => ({ ...p, education: p.education.filter((_,j)=>j!==i) }))} className="text-[#444] hover:text-red-400"><X size={12} /></button>}</div>
                          <input value={edu.degree} onChange={e => updEdu(i,'degree',e.target.value)} placeholder="B.Tech Computer Science" className={I} />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={edu.institution} onChange={e => updEdu(i,'institution',e.target.value)} placeholder="University Name" className={I} />
                            <input value={edu.year} onChange={e => updEdu(i,'year',e.target.value)} placeholder="2025" className={I} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Projects */}
                    <div className={S}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><Code size={13} className="text-[#f97316]" /><span className="text-xs font-bold text-white uppercase tracking-wider">Projects</span></div>
                        <button onClick={() => setRd(p => ({ ...p, projects: [...p.projects, { title:'', description:'', tech:'' }] }))} className="text-[10px] text-[#f97316] font-bold flex items-center gap-1"><Plus size={11} />Add</button>
                      </div>
                      {rd.projects.length === 0 && <p className="text-[10px] text-[#444]">Add projects to showcase hands-on experience</p>}
                      {rd.projects.map((proj, i) => (
                        <div key={i} className="space-y-2 pt-3 border-t border-[#1a1a1a] first:border-t-0 first:pt-0">
                          <div className="flex justify-between items-center"><p className="text-[10px] text-[#555] font-bold uppercase">Project {i+1}</p><button onClick={() => setRd(p => ({ ...p, projects: p.projects.filter((_,j)=>j!==i) }))} className="text-[#444] hover:text-red-400"><X size={12} /></button></div>
                          <input value={proj.title} onChange={e => updProj(i,'title',e.target.value)} placeholder="Project Name" className={I} />
                          <input value={proj.tech} onChange={e => updProj(i,'tech',e.target.value)} placeholder="Tech: React, Node.js, MongoDB" className={I} />
                          <textarea value={proj.description} onChange={e => updProj(i,'description',e.target.value)} placeholder="What you built and its impact" rows={2} className={I + ' resize-none'} />
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* Preview panel */}
                <div className="bg-[#0a0a0a] border border-[#252525] rounded-xl overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0">
                    <span className="text-xs font-bold text-[#555] uppercase tracking-wider">Preview · {TEMPLATE_META[template].name}</span>
                    <div className="flex gap-2">
                      <button onClick={handleCopy} title="Copy text" className="p-1.5 text-[#555] hover:text-white transition-colors"><Copy size={13} /></button>
                      <button onClick={handlePDF}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-lg text-[10px] font-bold transition-colors">
                        <Download size={12} /> Download PDF
                      </button>
                    </div>
                  </div>
                  <iframe
                    srcDoc={generateResumeHTML(rd, template)}
                    className="flex-1 w-full"
                    style={{ height: previewMode ? '78vh' : '68vh', border: 'none', background: '#fff' }}
                    title="Resume Preview"
                  />
                </div>

              </div>
            </motion.div>
          )}

          {/* ═══ AI OPTIMIZER TAB ═══ */}
          {mainTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {!currentResult ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="p-5 bg-[#f97316]/10 border border-[#f97316]/20 rounded-2xl mb-5">
                    <Wand2 size={40} className="text-[#f97316]" />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">AI Resume Optimizer</h2>
                  <p className="text-sm text-[#666] mb-6 max-w-md">
                    Go to the Jobs page, find a role, and click <strong className="text-white">Optimize Resume</strong>.
                    AI rewrites your resume to match that job's keywords and ATS requirements.
                  </p>
                  <button onClick={() => navigate('/jobs')}
                    className="px-6 py-3 bg-[#f97316] hover:bg-[#ea6a0f] text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2">
                    Browse Jobs <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* ATS score comparison */}
                  <div className="p-6 bg-[#161616] border border-[#252525] rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="relative inline-flex items-center justify-center mb-1">
                            <ScoreRing score={currentResult.atsBefore} />
                            <span className="absolute text-lg font-bold text-red-400">{currentResult.atsBefore}</span>
                          </div>
                          <p className="text-[10px] font-bold text-[#555] uppercase">Before</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <ArrowRight size={20} className="text-[#f97316]" />
                          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-xs font-black text-green-400 rounded-full">
                            +{currentResult.atsAfter - currentResult.atsBefore} pts
                          </span>
                        </div>
                        <div className="text-center">
                          <div className="relative inline-flex items-center justify-center mb-1">
                            <ScoreRing score={currentResult.atsAfter} />
                            <span className="absolute text-lg font-bold text-green-400">{currentResult.atsAfter}</span>
                          </div>
                          <p className="text-[10px] font-bold text-[#555] uppercase">After</p>
                        </div>
                        <div className="ml-4">
                          <p className="text-xl font-bold text-white">ATS Score</p>
                          {currentJob && <p className="text-sm text-[#666]">{currentJob.title} · {currentJob.company}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { resumeOptimizationService.downloadMarkdown(currentResult.optimizedResumeMarkdown, currentJob?.company || 'resume'); toast.success('Downloaded') }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/40 rounded-xl text-xs font-semibold text-[#999] hover:text-white transition-colors">
                          <Download size={13} /> MD
                        </button>
                        <button onClick={() => { resumeOptimizationService.downloadHTML(currentResult.optimizedResumeMarkdown, currentJob?.company || 'resume', currentJob?.company || '', currentJob?.title || ''); toast.success('Downloaded') }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-[#f97316] hover:bg-[#ea6a0f] rounded-xl text-xs font-bold text-white transition-colors">
                          <Download size={13} /> HTML
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Changes */}
                  <div className="p-5 bg-[#161616] border border-[#252525] rounded-2xl">
                    <p className="text-xs font-black text-[#f97316] uppercase tracking-widest mb-3">AI Improvements</p>
                    <div className="grid grid-cols-2 gap-2">
                      {currentResult.changes.map((c, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/10 rounded-xl">
                          <CheckCircle size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-[#999]">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-[#161616] border border-[#252525] rounded-2xl">
                      <p className="text-xs font-black text-green-400 uppercase tracking-widest mb-3">Keywords Added</p>
                      <div className="flex flex-wrap gap-2">
                        {currentResult.addedKeywords.length > 0
                          ? currentResult.addedKeywords.map((k, i) => <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-full"><Plus size={10} />{k}</span>)
                          : <span className="text-xs text-[#555]">None added</span>}
                      </div>
                    </div>
                    <div className="p-5 bg-[#161616] border border-[#252525] rounded-2xl">
                      <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Still Missing</p>
                      <div className="flex flex-wrap gap-2">
                        {currentResult.missingKeywords.length > 0
                          ? currentResult.missingKeywords.map((k, i) => <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-full"><Minus size={10} />{k}</span>)
                          : <span className="text-xs text-[#555]">None — great match!</span>}
                      </div>
                    </div>
                  </div>

                  {/* Sections accordion */}
                  {[{ key: 'summary', label: 'Professional Summary' }, { key: 'experience', label: 'Experience' }, { key: 'skills', label: 'Skills' }].map(sec => (
                    <div key={sec.key} className="bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden">
                      <button onClick={() => setAiSection(aiSection === sec.key ? null : sec.key)}
                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a1a] transition-colors">
                        <span className="text-sm font-bold text-white">{sec.label}</span>
                        <ChevronRight size={15} className={`text-[#555] transition-transform ${aiSection === sec.key ? 'rotate-90' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {aiSection === sec.key && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                            <div className="px-5 pb-5">
                              {sec.key === 'summary' && <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-sm text-white leading-relaxed">{currentResult.optimizedSummary}</div>}
                              {sec.key === 'experience' && <div className="space-y-3">{currentResult.optimizedExperience.map((exp, i) => (<div key={i}><p className="text-xs font-bold text-[#666] mb-1">{exp.title} @ {exp.company} · {exp.duration}</p><div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-sm text-white leading-relaxed">{exp.description}</div></div>))}</div>}
                              {sec.key === 'skills' && <div className="flex flex-wrap gap-2">{currentResult.optimizedSkills.map((s, i) => <span key={i} className="px-3 py-1 bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs rounded-full">{s}</span>)}</div>}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {currentResult.remainingWeaknesses.length > 0 && (
                    <div className="p-5 bg-[#161616] border border-[#252525] rounded-2xl">
                      <p className="text-xs font-black text-red-400 uppercase tracking-widest mb-3">Remaining Weaknesses</p>
                      <ul className="space-y-2">{currentResult.remainingWeaknesses.map((w, i) => <li key={i} className="flex items-start gap-2 text-sm text-[#999]"><XCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />{w}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ HISTORY TAB ═══ */}
          {mainTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              {versions.length === 0 ? (
                <div className="text-center py-20">
                  <FileText size={40} className="text-[#2a2a2a] mx-auto mb-3" />
                  <p className="text-[#555] text-sm">No AI optimizations yet</p>
                  <button onClick={() => setMainTab('ai')} className="mt-3 text-sm text-[#f97316] hover:underline">Go to AI Optimizer</button>
                </div>
              ) : versions.map(v => (
                <div key={v.id} className="p-5 bg-[#161616] border border-[#252525] hover:border-[#f97316]/20 rounded-xl transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{v.job_title}</span>
                        <span className="text-xs text-[#f97316] font-semibold">@ {v.company_name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#555]">
                        <span className="flex items-center gap-1"><Clock size={11} />{new Date(v.created_at).toLocaleDateString()}</span>
                        <span className="text-red-400">ATS {v.ats_before}</span>
                        <ArrowRight size={10} />
                        <span className="text-green-400">ATS {v.ats_after}</span>
                        <span className="text-green-400 font-bold">+{(v.ats_after - v.ats_before).toFixed(0)} pts</span>
                      </div>
                      {v.added_keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {v.added_keywords.slice(0, 5).map((k, i) => <span key={i} className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded border border-green-500/20">{k}</span>)}
                          {v.added_keywords.length > 5 && <span className="text-[10px] text-[#555]">+{v.added_keywords.length - 5} more</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setPreviewVersion(v)} className="p-2 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/30 rounded-lg text-[#555] hover:text-[#f97316] transition-colors"><Eye size={14} /></button>
                      <button onClick={() => { resumeOptimizationService.downloadMarkdown(v.optimized_resume_markdown, v.company_name); toast.success('Downloaded') }} className="p-2 bg-[#1a1a1a] border border-[#252525] hover:border-[#f97316]/30 rounded-lg text-[#555] hover:text-[#f97316] transition-colors"><Download size={14} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-2 bg-[#1a1a1a] border border-[#252525] hover:border-red-500/30 rounded-lg text-[#555] hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewVersion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70" onClick={() => setPreviewVersion(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[80vh] bg-[#161616] border border-[#252525] rounded-2xl overflow-hidden z-10">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#252525]">
                <div>
                  <p className="text-sm font-bold text-white">{previewVersion.job_title} @ {previewVersion.company_name}</p>
                  <p className="text-xs text-[#555]">ATS {previewVersion.ats_before} → {previewVersion.ats_after}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { resumeOptimizationService.downloadMarkdown(previewVersion.optimized_resume_markdown, previewVersion.company_name); toast.success('Downloaded') }}
                    className="px-3 py-1.5 bg-[#f97316] text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Download size={12} /> Download
                  </button>
                  <button onClick={() => setPreviewVersion(null)} className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"><X size={16} className="text-[#555]" /></button>
                </div>
              </div>
              <div className="overflow-y-auto p-6 max-h-[calc(80vh-60px)]">
                <pre className="text-xs text-[#999] whitespace-pre-wrap font-mono leading-relaxed">{previewVersion.optimized_resume_markdown}</pre>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
