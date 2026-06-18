import { API_BASE } from '../lib/api'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Briefcase, Heart, ExternalLink,
  Zap, Target, ChevronDown, ChevronUp, CheckCircle,
  XCircle, Sparkles, Star, TrendingUp, RefreshCw, Loader2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/DashboardLayout'
import { useOnboardingStore } from '../store/onboardingStore'
import { useOptimizationStore } from '../store/optimizationStore'
import { resumeOptimizationService } from '../services/resumeOptimizationService'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

type FilterMatch = 'all' | 'high' | 'medium' | 'low'

const Jobs = () => {
  const navigate = useNavigate()
  const { scrapedJobs, profile, setScrapedJobs, setIsSearchingJobs, isSearchingJobs, jobsLastFetched } = useOnboardingStore()
  const { setResult } = useOptimizationStore()
  const { user } = useAuthStore()

  const [searchTerm, setSearchTerm]         = useState('')
  const [filterMatch, setFilterMatch]       = useState<FilterMatch>('all')
  const [savedJobIds, setSavedJobIds]       = useState<Set<string>>(new Set())
  const [expandedJob, setExpandedJob]       = useState<string | null>(null)
  const [filterLocation, setFilterLocation] = useState('')
  const [filterSource, setFilterSource]     = useState('')
  const [optimizingJobId, setOptimizingJobId] = useState<string | null>(null)

  const sources = [...new Set(scrapedJobs.map(j => j.source))]
  const locations = [...new Set(scrapedJobs.map(j => j.location).filter(Boolean))].slice(0, 8)

  const filtered = scrapedJobs
    .filter(j =>
      (!searchTerm || j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!filterLocation || j.location?.toLowerCase().includes(filterLocation.toLowerCase())) &&
      (!filterSource || j.source === filterSource) &&
      (filterMatch === 'all' || (filterMatch === 'high' && j.matchScore >= 75) || (filterMatch === 'medium' && j.matchScore >= 50 && j.matchScore < 75) || (filterMatch === 'low' && j.matchScore < 50))
    )

  const stats = {
    total: scrapedJobs.length,
    high: scrapedJobs.filter(j => j.matchScore >= 75).length,
    medium: scrapedJobs.filter(j => j.matchScore >= 50 && j.matchScore < 75).length,
    saved: savedJobIds.size,
  }

  const toggleSave = (id: string) => {
    setSavedJobIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); toast.success('Job removed') }
      else { next.add(id); toast.success('Job saved') }
      return next
    })
  }

  const refreshJobs = async () => {
    if (!profile.desiredJobTitle) { navigate('/onboarding'); return }
    setIsSearchingJobs(true)
    toast.loading('Searching LinkedIn, Indeed & more…', { id: 'refresh' })
    try {
      const resp = await fetch(`${API_BASE}/jobs/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: profile.desiredJobTitle,
          location: profile.preferredLocations[0] || 'Remote',
          job_type: profile.employmentType || 'full-time',
          experience_level: profile.experienceLevel || 'mid',
          max_results: 30,
          include_linkedin: true,
          include_indeed: true,
        }),
      })
      const data = await resp.json()
      const rawJobs = data.jobs || []
      
      // Log source breakdown
      console.log('[Jobs] Raw data received:', {
        total: rawJobs.length,
        sources: data.sources,
        sample: rawJobs.slice(0, 3).map((j: any) => ({ 
          title: j.title, 
          source: j.source,
          company: j.company,
          hasSource: !!j.source 
        }))
      })
      
      // Check if all jobs have source field
      const jobsWithoutSource = rawJobs.filter((j: any) => !j.source)
      if (jobsWithoutSource.length > 0) {
        console.warn('[Jobs] Found jobs without source field:', jobsWithoutSource.length)
      }
      
      // Process jobs with AI matching
      const scored = rawJobs.map((job: any, i: number) => {
        const jobText = `${job.title} ${job.summary || ''} ${job.company}`.toLowerCase()
        const matching = profile.skills.filter(s => jobText.includes(s.toLowerCase()))
        const missing = profile.missingKeywords?.filter(k => jobText.includes(k.toLowerCase())) || []
        
        // Enhanced scoring with source weighting
        let score = 40 + matching.length * 12
        if (profile.preferredLocations.some(l => job.location?.toLowerCase().includes(l.toLowerCase()))) score += 15
        if (profile.workMode === 'remote' && job.location?.toLowerCase().includes('remote')) score += 10
        if (job.source === 'LinkedIn') score += 5 // LinkedIn jobs often higher quality
        if (job.salary) score += 5 // Jobs with salary info
        
        score = Math.min(95, score)
        
        const reasons: string[] = []
        if (matching[0]) reasons.push(`${matching[0]} skills match`)
        if (profile.workMode === 'remote' && job.location?.toLowerCase().includes('remote')) reasons.push('Remote work available')
        if (profile.preferredLocations.some(l => job.location?.toLowerCase().includes(l.toLowerCase()))) reasons.push('Preferred location')
        if (job.source === 'LinkedIn') reasons.push('Premium source')
        if (job.salary) reasons.push('Salary disclosed')
        
        return { 
          ...job, 
          id: `scraped-${i}`, 
          matchScore: score, 
          matchingSkills: matching, 
          missingSkills: missing, 
          matchReasons: reasons 
        }
      })
      
      scored.sort((a: any, b: any) => b.matchScore - a.matchScore)
      setScrapedJobs(scored)
      
      console.log('[Jobs] Processed jobs:', {
        total: scored.length,
        bySource: scored.reduce((acc: any, job: any) => {
          acc[job.source] = (acc[job.source] || 0) + 1
          return acc
        }, {}),
        first5: scored.slice(0, 5).map((j: any) => ({ 
          title: j.title, 
          company: j.company, 
          source: j.source 
        }))
      })
      
      // Show source breakdown
      const sourceBreakdown = data.sources || {}
      const sourceMsg = Object.entries(sourceBreakdown)
        .map(([source, count]) => `${source}: ${count}`)
        .join(', ')
      
      toast.success(`Found ${scored.length} jobs (${sourceMsg})`, { id: 'refresh' })
    } catch {
      toast.error('Search failed - try again', { id: 'refresh' })
    } finally {
      setIsSearchingJobs(false)
    }
  }

  const matchBg = (score: number) => score >= 75 ? 'bg-green-500/10 border-green-500/20 text-green-400' : score >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-red-500/10 border-red-500/20 text-red-400'

  const handleOptimize = async (job: any) => {
    if (!profile.resumeAnalyzed) {
      toast.error('Upload your resume first')
      navigate('/resume')
      return
    }
    setOptimizingJobId(job.id)
    toast.loading('AI is optimizing your resume…', { id: 'optimize' })
    try {
      const result = await resumeOptimizationService.optimize({
        parsed_resume: {
          name: profile.fullName,
          email: profile.email,
          summary: profile.resumeSummary,
          skills: profile.skills,
          experience: profile.currentJobTitle ? [{ title: profile.currentJobTitle, company: profile.previousCompanies?.[0] || '', duration: '', description: '' }] : [],
          education: profile.education || [],
          certifications: profile.certifications || [],
        },
        ats_analysis: {
          score: profile.atsScore || 65,
          strengths: profile.strengths || [],
          weaknesses: profile.weaknesses || [],
          keyword_analysis: { missing_skills: profile.missingKeywords || [] },
        },
        job_title: job.title,
        company_name: job.company,
        job_description: `${job.title} at ${job.company}. ${job.summary || ''} Location: ${job.location}`,
        job_id: job.id,
        user_id: user?.id,
      })
      setResult(result, { title: job.title, company: job.company, description: job.summary || '', id: job.id })
      toast.success('Resume optimized!', { id: 'optimize' })
      navigate('/optimize')
    } catch (e: any) {
      toast.error(e.message || 'Optimization failed', { id: 'optimize' })
    } finally {
      setOptimizingJobId(null)
    }
  }

  // ── Empty state ───────────────────────────────────────────────────────────

  if (scrapedJobs.length === 0) {
    return (
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[500px] text-center">
          <div className="p-6 bg-dark-accent/10 border border-dark-accent/30 rounded-2xl mb-6">
            <Target size={56} className="text-dark-accent mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-dark-text-primary mb-2">No Jobs Yet</h3>
          <p className="text-dark-text-secondary mb-8 max-w-md text-sm">
            Upload your resume and complete the career profile to get personalized job matches scraped live from the web.
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/resume')}
              className="px-6 py-3 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-dark-accent/20">
              Upload Resume
            </button>
            {profile.resumeAnalyzed && (
              <button onClick={() => navigate('/onboarding')}
                className="px-6 py-3 bg-dark-card border border-dark-border/50 hover:border-dark-accent/40 text-dark-text-secondary hover:text-dark-text-primary rounded-xl font-semibold text-sm transition-all">
                Set Up Career Profile
              </button>
            )}
          </div>
        </motion.div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-text-primary mb-1">Personalized Jobs</h1>
            <p className="text-sm text-dark-text-secondary">
              Matched to your profile · {profile.desiredJobTitle || 'All roles'}
              {jobsLastFetched && <span className="ml-2 text-dark-text-secondary/50">· Last updated {new Date(jobsLastFetched).toLocaleTimeString()}</span>}
            </p>
          </div>
          <button onClick={refreshJobs} disabled={isSearchingJobs}
            className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border/50 hover:border-dark-accent/40 text-dark-text-secondary hover:text-dark-text-primary rounded-xl text-sm font-semibold transition-all disabled:opacity-50">
            {isSearchingJobs ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/5 border-blue-500/20' },
            { label: 'High Match', value: stats.high, icon: Star, color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
            { label: 'Medium Match', value: stats.medium, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/5 border-yellow-500/20' },
            { label: 'Saved', value: stats.saved, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/5 border-pink-500/20' },
          ].map(s => (
            <div key={s.label} className={`p-4 border rounded-xl ${s.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <s.icon size={16} className={s.color} />
                <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-dark-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sources Breakdown */}
        {sources.length > 0 && (
          <div className="p-4 bg-dark-card border border-dark-border/50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-dark-accent" />
                <h3 className="text-xs font-bold text-dark-text-primary uppercase tracking-wider">
                  Job Sources ({sources.length} active)
                </h3>
              </div>
              {filterSource && (
                <button
                  onClick={() => setFilterSource('')}
                  className="text-xs text-dark-accent hover:text-dark-accent-hover font-semibold"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map(source => {
                const count = scrapedJobs.filter(j => j.source === source).length
                const isActive = filterSource === source
                return (
                  <button
                    key={source}
                    onClick={() => setFilterSource(isActive ? '' : source)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-dark-accent text-white shadow-lg shadow-dark-accent/20'
                        : 'bg-dark-bg-secondary text-dark-text-secondary hover:text-dark-text-primary border border-dark-border/50 hover:border-dark-accent/40'
                    }`}
                  >
                    <span className="font-black">{source}</span> 
                    <span className={`ml-1.5 ${isActive ? 'opacity-90' : 'opacity-60'}`}>
                      ({count})
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 text-[10px] text-dark-text-secondary/60">
              Click any source to filter jobs • Total: {scrapedJobs.length} jobs from {sources.length} sources
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary" size={16} />
            <input type="text" placeholder="Search jobs or companies…"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-dark-card border border-dark-border/50 rounded-xl text-sm text-dark-text-primary focus:outline-none focus:border-dark-accent/50 placeholder-dark-text-secondary/40" />
          </div>

          <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
            className="px-3 py-2.5 bg-dark-card border border-dark-border/50 rounded-xl text-sm text-dark-text-secondary focus:outline-none focus:border-dark-accent/50 min-w-[130px]">
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>

          <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
            className="px-3 py-2.5 bg-dark-card border border-dark-border/50 rounded-xl text-sm text-dark-text-secondary focus:outline-none focus:border-dark-accent/50 min-w-[120px]">
            <option value="">All Sources</option>
            {sources.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="flex gap-1">
            {(['all', 'high', 'medium', 'low'] as FilterMatch[]).map(f => (
              <button key={f} onClick={() => setFilterMatch(f)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filterMatch === f ? 'bg-dark-accent text-white' : 'bg-dark-card border border-dark-border/50 text-dark-text-secondary hover:border-dark-accent/40'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Job cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence>
            {filtered.map((job, index) => {
              const mb = matchBg(job.matchScore)
              const isSaved = savedJobIds.has(job.id)
              const isExpanded = expandedJob === job.id

              return (
                <motion.div key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-dark-card border border-dark-border/50 hover:border-dark-accent/20 rounded-xl overflow-hidden transition-all">

                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-dark-bg-secondary text-dark-text-secondary text-[10px] font-black rounded uppercase tracking-wider">{job.source}</span>
                          {job.salary && <span className="text-xs text-green-400 font-semibold">{job.salary}</span>}
                        </div>
                        <h3 className="text-sm font-bold text-dark-text-primary truncate">{job.title}</h3>
                        <p className="text-xs text-dark-accent font-semibold mt-0.5">{job.company}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={11} className="text-dark-text-secondary/40" />
                          <span className="text-xs text-dark-text-secondary/60">{job.location}</span>
                        </div>
                      </div>

                      {/* Match badge */}
                      <div className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 border rounded-full ${mb}`}>
                        <Zap size={10} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase">{job.matchScore}%</span>
                      </div>
                    </div>

                    {/* Summary */}
                    {job.summary && (
                      <p className="text-xs text-dark-text-secondary line-clamp-2 mb-3">{job.summary}</p>
                    )}

                    {/* Matching skills */}
                    {job.matchingSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {job.matchingSkills.slice(0, 4).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold rounded">{s}</span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-dark-border/30">
                      {job.url ? (
                        <a href={job.url} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-dark-accent hover:bg-dark-accent-hover text-white text-xs font-bold rounded-lg transition-all">
                          <ExternalLink size={12} /> Apply Now
                        </a>
                      ) : (
                        <button className="flex-1 py-2 bg-dark-accent/20 text-dark-accent text-xs font-bold rounded-lg cursor-not-allowed opacity-60">
                          No Link
                        </button>
                      )}

                      <button
                        onClick={() => handleOptimize(job)}
                        disabled={optimizingJobId === job.id || !profile.resumeAnalyzed}
                        className="flex items-center gap-1.5 px-3 py-2 bg-dark-bg-secondary border border-dark-border/50 hover:border-dark-accent/40 hover:text-dark-accent text-dark-text-secondary text-xs font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!profile.resumeAnalyzed ? "Upload your resume first" : "Optimize Resume for this job"}
                      >
                        {optimizingJobId === job.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        Optimize
                      </button>

                      <button onClick={() => toggleSave(job.id)}
                        className={`p-2 rounded-lg border transition-all ${isSaved ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-dark-bg-secondary border-dark-border/50 text-dark-text-secondary hover:text-pink-400'}`}>
                        <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>

                      <button onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                        className="p-2 rounded-lg border border-dark-border/50 bg-dark-bg-secondary text-dark-text-secondary hover:text-dark-accent transition-all">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* AI Insights panel */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-dark-border/30 pt-4 bg-dark-bg-secondary/30">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={12} className="text-dark-accent" />
                            <span className="text-xs font-black text-dark-accent uppercase tracking-widest">AI Match Insights</span>
                          </div>

                          {job.matchReasons.length > 0 && (
                            <div className="mb-3">
                              <p className="text-[10px] font-bold text-dark-text-secondary uppercase tracking-widest mb-2">Why this matches you</p>
                              <ul className="space-y-1">
                                {job.matchReasons.map((r, i) => (
                                  <li key={i} className="flex items-center gap-2 text-xs text-green-400">
                                    <CheckCircle size={11} className="flex-shrink-0" /> {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.missingSkills.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-dark-text-secondary uppercase tracking-widest mb-2">Missing Skills</p>
                              <ul className="space-y-1">
                                {job.missingSkills.slice(0, 4).map((s, i) => (
                                  <li key={i} className="flex items-center gap-2 text-xs text-red-400">
                                    <XCircle size={11} className="flex-shrink-0" /> {s}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {job.matchReasons.length === 0 && job.missingSkills.length === 0 && (
                            <p className="text-xs text-dark-text-secondary">Complete your profile to see detailed match insights.</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Target size={48} className="text-dark-text-secondary/20 mx-auto mb-4" />
            <p className="text-dark-text-secondary">No jobs match your filters</p>
            <button onClick={() => { setSearchTerm(''); setFilterMatch('all'); setFilterLocation(''); setFilterSource('') }}
              className="mt-3 text-sm text-dark-accent hover:underline">Clear filters</button>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default Jobs
