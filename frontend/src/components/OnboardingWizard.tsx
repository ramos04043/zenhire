import { API_BASE } from '../lib/api'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, ChevronRight, ChevronLeft, Sparkles,
  X, Plus, Zap, Loader2
} from 'lucide-react'
import { useOnboardingStore, type CandidateProfile } from '../store/onboardingStore'
import toast from 'react-hot-toast'

// ── constants ────────────────────────────────────────────────────────────────

const WORK_MODES = ['remote', 'hybrid', 'on-site', 'no-preference'] as const
const LOCATIONS = ['Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Remote', 'Worldwide', 'New York', 'San Francisco', 'London', 'Berlin']
const EXP_LEVELS = [
  { value: 'fresher', label: 'Fresher' },
  { value: '1-3', label: '1–3 Years' },
  { value: '3-5', label: '3–5 Years' },
  { value: '5-8', label: '5–8 Years' },
  { value: '8+', label: '8+ Years' },
] as const
const NOTICE_PERIODS = [
  { value: 'immediately', label: 'Immediately Available' },
  { value: '15-days', label: '15 Days' },
  { value: '30-days', label: '30 Days' },
  { value: '60-days', label: '60 Days' },
  { value: '90-days', label: '90 Days' },
] as const
const EMP_TYPES = ['full-time', 'internship', 'contract', 'freelance', 'part-time'] as const
const INDUSTRIES = ['AI', 'SaaS', 'FinTech', 'Healthcare', 'Gaming', 'EdTech', 'Cybersecurity', 'Cloud', 'E-commerce', 'Blockchain', 'Robotics', 'Media']
const TOP_COMPANIES = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'OpenAI', 'Anthropic', 'Stripe', 'Airbnb', 'Zoho', 'Freshworks', 'No Preference']
const SALARY_MARKS = [4, 6, 8, 10, 12, 15, 18, 25, 30, 40, 50]

// ── sub-components ────────────────────────────────────────────────────────────

const StepTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-dark-text-primary mb-1">{title}</h2>
    {subtitle && <p className="text-sm text-dark-text-secondary">{subtitle}</p>}
  </div>
)

const OptionChip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
      selected
        ? 'bg-dark-accent border-dark-accent text-white shadow-lg shadow-dark-accent/20'
        : 'bg-dark-card border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/40 hover:text-dark-text-primary'
    }`}
  >
    {label}
  </button>
)

// ── step renderers ────────────────────────────────────────────────────────────

function Step1({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const suggestions = ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'AI Engineer', 'DevOps Engineer', 'Data Scientist', 'Product Manager', 'Full Stack Developer']
  return (
    <>
      <StepTitle title="What role are you looking for?" subtitle="We'll use this to find the best matching jobs" />
      <input
        type="text"
        value={profile.desiredJobTitle || ''}
        onChange={e => update({ desiredJobTitle: e.target.value })}
        placeholder="e.g. Senior Backend Engineer"
        className="w-full px-4 py-3 bg-dark-card border border-dark-border/50 rounded-xl text-dark-text-primary placeholder-dark-text-secondary/40 focus:outline-none focus:border-dark-accent/60 mb-4"
      />
      <p className="text-xs text-dark-text-secondary mb-3 uppercase tracking-widest font-bold">Suggestions</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map(s => (
          <OptionChip key={s} label={s} selected={profile.desiredJobTitle === s} onClick={() => update({ desiredJobTitle: s })} />
        ))}
      </div>
    </>
  )
}

function Step2({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const icons: Record<string, string> = { remote: '🌐', hybrid: '🏢', 'on-site': '📍', 'no-preference': '✨' }
  return (
    <>
      <StepTitle title="Preferred work mode?" />
      <div className="grid grid-cols-2 gap-3">
        {WORK_MODES.map(m => (
          <button key={m} onClick={() => update({ workMode: m })}
            className={`p-5 rounded-xl border text-left transition-all ${profile.workMode === m ? 'bg-dark-accent/10 border-dark-accent text-dark-accent' : 'bg-dark-card border-dark-border/50 hover:border-dark-accent/30'}`}>
            <div className="text-2xl mb-2">{icons[m]}</div>
            <p className="text-sm font-semibold text-dark-text-primary capitalize">{m.replace('-', ' ')}</p>
          </button>
        ))}
      </div>
    </>
  )
}

function Step3({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const toggle = (loc: string) => {
    const cur = profile.preferredLocations
    update({ preferredLocations: cur.includes(loc) ? cur.filter(l => l !== loc) : [...cur, loc] })
  }
  return (
    <>
      <StepTitle title="Preferred locations?" subtitle="Select all that apply" />
      <div className="flex flex-wrap gap-2">
        {LOCATIONS.map(l => (
          <button key={l} onClick={() => toggle(l)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
              profile.preferredLocations.includes(l) ? 'bg-dark-accent border-dark-accent text-white' : 'bg-dark-card border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/40'
            }`}>
            {profile.preferredLocations.includes(l) && <CheckCircle size={12} />}
            {l}
          </button>
        ))}
      </div>
    </>
  )
}

function Step4({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  return (
    <>
      <StepTitle title="Your experience level?" subtitle="Pre-filled from your resume if detected" />
      <div className="space-y-2">
        {EXP_LEVELS.map(l => (
          <button key={l.value} onClick={() => update({ experienceLevel: l.value })}
            className={`w-full px-5 py-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              profile.experienceLevel === l.value ? 'bg-dark-accent/10 border-dark-accent' : 'bg-dark-card border-dark-border/50 hover:border-dark-accent/30'
            }`}>
            <span className={`text-sm font-semibold ${profile.experienceLevel === l.value ? 'text-dark-accent' : 'text-dark-text-primary'}`}>{l.label}</span>
            {profile.experienceLevel === l.value && <CheckCircle size={16} className="text-dark-accent" />}
          </button>
        ))}
      </div>
    </>
  )
}

function Step5({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const min = profile.salaryMin ?? 8
  const max = profile.salaryMax ?? 18
  return (
    <>
      <StepTitle title="Expected salary range?" subtitle="In LPA (Lakhs Per Annum)" />
      <div className="p-6 bg-dark-card border border-dark-border/50 rounded-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-dark-accent">₹{min}L</span>
          <span className="text-dark-text-secondary">–</span>
          <span className="text-2xl font-bold text-dark-accent">₹{max}L{max >= 50 ? '+' : ''}</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-dark-text-secondary uppercase tracking-widest font-bold mb-2 block">Minimum</label>
            <input type="range" min={4} max={50} step={1} value={min}
              onChange={e => update({ salaryMin: +e.target.value })}
              className="w-full accent-orange-500" />
          </div>
          <div>
            <label className="text-xs text-dark-text-secondary uppercase tracking-widest font-bold mb-2 block">Maximum</label>
            <input type="range" min={4} max={50} step={1} value={max}
              onChange={e => update({ salaryMax: +e.target.value })}
              className="w-full accent-orange-500" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {SALARY_MARKS.map(s => (
          <button key={s} onClick={() => update({ salaryMin: s, salaryMax: Math.min(s + 6, 50) })}
            className="px-3 py-1.5 bg-dark-card border border-dark-border/50 hover:border-dark-accent/40 text-dark-text-secondary text-xs rounded-lg transition-colors">
            ₹{s}L
          </button>
        ))}
      </div>
    </>
  )
}

function Step6({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  return (
    <>
      <StepTitle title="Notice period?" />
      <div className="space-y-2">
        {NOTICE_PERIODS.map(n => (
          <button key={n.value} onClick={() => update({ noticePeriod: n.value })}
            className={`w-full px-5 py-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              profile.noticePeriod === n.value ? 'bg-dark-accent/10 border-dark-accent' : 'bg-dark-card border-dark-border/50 hover:border-dark-accent/30'
            }`}>
            <span className={`text-sm font-semibold ${profile.noticePeriod === n.value ? 'text-dark-accent' : 'text-dark-text-primary'}`}>{n.label}</span>
            {profile.noticePeriod === n.value && <CheckCircle size={16} className="text-dark-accent" />}
          </button>
        ))}
      </div>
    </>
  )
}

function Step7({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  return (
    <>
      <StepTitle title="Employment type?" />
      <div className="flex flex-wrap gap-3">
        {EMP_TYPES.map(t => (
          <OptionChip key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} selected={profile.employmentType === t} onClick={() => update({ employmentType: t })} />
        ))}
      </div>
    </>
  )
}

function Step8({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const toggle = (ind: string) => {
    const cur = profile.preferredIndustries
    update({ preferredIndustries: cur.includes(ind) ? cur.filter(i => i !== ind) : [...cur, ind] })
  }
  return (
    <>
      <StepTitle title="Preferred industries?" subtitle="Select all that interest you" />
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map(ind => (
          <button key={ind} onClick={() => toggle(ind)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
              profile.preferredIndustries.includes(ind) ? 'bg-dark-accent border-dark-accent text-white' : 'bg-dark-card border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/40'
            }`}>
            {profile.preferredIndustries.includes(ind) && <CheckCircle size={12} />}
            {ind}
          </button>
        ))}
      </div>
    </>
  )
}

function Step9({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const toggle = (c: string) => {
    if (c === 'No Preference') { update({ preferredCompanies: [] }); return }
    const cur = profile.preferredCompanies
    update({ preferredCompanies: cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c] })
  }
  return (
    <>
      <StepTitle title="Preferred companies?" subtitle="Optional — leave empty for all companies" />
      <div className="flex flex-wrap gap-2">
        {TOP_COMPANIES.map(c => (
          <button key={c} onClick={() => toggle(c)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all flex items-center gap-1.5 ${
              (c === 'No Preference' && profile.preferredCompanies.length === 0) || profile.preferredCompanies.includes(c)
                ? 'bg-dark-accent border-dark-accent text-white'
                : 'bg-dark-card border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/40'
            }`}>
            {c}
          </button>
        ))}
      </div>
    </>
  )
}

function Step10({ profile, update }: { profile: CandidateProfile; update: (u: Partial<CandidateProfile>) => void }) {
  const [newSkill, setNewSkill] = useState('')
  const add = () => {
    const s = newSkill.trim()
    if (s && !profile.skills.includes(s)) {
      update({ skills: [...profile.skills, s] })
      setNewSkill('')
    }
  }
  const remove = (skill: string) => update({ skills: profile.skills.filter(s => s !== skill) })

  return (
    <>
      <StepTitle title="Confirm your skills" subtitle="AI detected these from your resume — edit as needed" />
      <div className="flex flex-wrap gap-2 mb-4 min-h-[60px]">
        {profile.skills.map(s => (
          <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-accent/10 border border-dark-accent/30 text-dark-accent text-sm rounded-xl">
            <CheckCircle size={12} /> {s}
            <button onClick={() => remove(s)} className="ml-1 hover:text-red-400 transition-colors"><X size={12} /></button>
          </span>
        ))}
        {profile.skills.length === 0 && <p className="text-dark-text-secondary text-sm">No skills detected — add them below</p>}
      </div>
      <div className="flex gap-2">
        <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a skill (e.g. Kubernetes)"
          className="flex-1 px-4 py-2.5 bg-dark-card border border-dark-border/50 rounded-xl text-sm text-dark-text-primary placeholder-dark-text-secondary/40 focus:outline-none focus:border-dark-accent/50" />
        <button onClick={add} className="px-4 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl transition-colors">
          <Plus size={16} />
        </button>
      </div>
    </>
  )
}

// ── main wizard ───────────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const navigate = useNavigate()
  const {
    currentStep, totalSteps, profile,
    nextStep, prevStep, updateProfile,
    completeOnboarding, setScrapedJobs, setIsSearchingJobs, isSearchingJobs
  } = useOnboardingStore()

  const progress = (currentStep / totalSteps) * 100

  const searchJobs = async () => {
    setIsSearchingJobs(true)
    toast.loading('Discovering jobs for you…', { id: 'job-search' })
    try {
      const resp = await fetch(`${API_BASE}/jobs/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: profile.desiredJobTitle || profile.currentJobTitle || 'Software Engineer',
          location: profile.preferredLocations[0] || 'Remote',
          job_type: profile.employmentType || 'full-time',
          experience_level: profile.experienceLevel || 'mid',
          max_results: 20,
        }),
      })
      const data = await resp.json()
      const rawJobs = data.jobs || []

      // Compute match scores
      const scored = rawJobs.map((job: any, i: number) => {
        const jobText = `${job.title} ${job.summary || ''} ${job.company}`.toLowerCase()
        const matching = profile.skills.filter(s => jobText.includes(s.toLowerCase()))
        const missing = profile.missingKeywords?.filter(k => jobText.includes(k.toLowerCase())) || []
        const score = Math.min(95, 40 + matching.length * 12 + (profile.preferredLocations.some(l => job.location?.toLowerCase().includes(l.toLowerCase())) ? 15 : 0))
        const reasons: string[] = []
        if (matching.length) reasons.push(`${matching[0]} matches`)
        if (profile.workMode === 'remote' && job.location?.toLowerCase().includes('remote')) reasons.push('Remote preference matches')
        if (profile.preferredLocations.some(l => job.location?.toLowerCase().includes(l.toLowerCase()))) reasons.push('Location matches')
        return { ...job, id: `scraped-${i}`, matchScore: score, matchingSkills: matching, missingSkills: missing, matchReasons: reasons }
      })

      scored.sort((a: any, b: any) => b.matchScore - a.matchScore)
      setScrapedJobs(scored)
      toast.success(`Found ${scored.length} matching jobs!`, { id: 'job-search' })
    } catch {
      toast.error('Job search failed', { id: 'job-search' })
    } finally {
      setIsSearchingJobs(false)
    }
  }

  const handleFinish = async () => {
    await searchJobs()
    completeOnboarding()
    navigate('/jobs')
  }

  const stepProps = { profile, update: updateProfile }

  const stepComponents: Record<number, JSX.Element> = {
    1: <Step1 {...stepProps} />,
    2: <Step2 {...stepProps} />,
    3: <Step3 {...stepProps} />,
    4: <Step4 {...stepProps} />,
    5: <Step5 {...stepProps} />,
    6: <Step6 {...stepProps} />,
    7: <Step7 {...stepProps} />,
    8: <Step8 {...stepProps} />,
    9: <Step9 {...stepProps} />,
    10: <Step10 {...stepProps} />,
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-dark-accent/10 border border-dark-accent/20 rounded-full mb-4">
            <Zap size={12} className="text-dark-accent" strokeWidth={3} />
            <span className="text-xs font-black text-dark-accent uppercase tracking-widest">Career Profile Setup</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {['Resume', 'AI Analysis', 'Career Profile', 'Finding Jobs', 'Complete'].map((label, i) => {
            const done = i < 2 || (i === 2 && currentStep === totalSteps)
            const active = i === 2
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done ? 'bg-green-500 border-green-500 text-white' :
                    active ? 'bg-dark-accent border-dark-accent text-white' :
                    'bg-dark-card border-dark-border/50 text-dark-text-secondary'
                  }`}>
                    {done ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${active ? 'text-dark-accent' : 'text-dark-text-secondary'}`}>{label}</span>
                </div>
                {i < 4 && <div className={`w-12 h-px mx-2 mb-4 ${done ? 'bg-green-500' : 'bg-dark-border/50'}`} />}
              </div>
            )
          })}
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border/50 rounded-2xl overflow-hidden">
          {/* Step progress bar */}
          <div className="h-1 bg-dark-border/30">
            <motion.div
              className="h-full bg-dark-accent"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-8">
            {/* Step counter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all ${i + 1 <= currentStep ? 'bg-dark-accent w-4' : 'bg-dark-border/50 w-1.5'}`} />
                ))}
              </div>
              <span className="text-xs text-dark-text-secondary font-bold">{currentStep} / {totalSteps}</span>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {stepComponents[currentStep]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer nav */}
          <div className="px-8 pb-8 flex items-center justify-between gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-bg-secondary border border-dark-border/50 rounded-xl text-sm font-semibold text-dark-text-secondary hover:text-dark-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Back
            </button>

            <button
              onClick={() => updateProfile({})}
              className="text-xs text-dark-text-secondary hover:text-dark-text-primary transition-colors"
            >
              Skip
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-dark-accent/20"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isSearchingJobs}
                className="flex items-center gap-2 px-6 py-2.5 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-dark-accent/20 disabled:opacity-70"
              >
                {isSearchingJobs ? <><Loader2 size={16} className="animate-spin" /> Finding Jobs…</> : <><Sparkles size={16} /> Find My Jobs</>}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
