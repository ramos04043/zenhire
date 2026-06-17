import { Sparkles, MapPin, Bookmark, ExternalLink, Briefcase, Zap, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../../store/onboardingStore'

// Consistent color per company initial
const AVATAR_COLORS = [
  '#f5703a', '#6366f1', '#1ab87a', '#e879f9',
  '#38bdf8', '#fb923c', '#a78bfa', '#34d399',
]
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]

// Source badge style
const sourceBadge = (source: string) => {
  const map: Record<string, string> = {
    LinkedIn:    'bg-sky-500/10 text-sky-400 border-sky-500/20',
    Internshala: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Naukri:      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }
  return map[source] ?? 'bg-[#1e1e1e] text-[#888] border-[#2a2a2a]'
}

const matchBarColor = (score: number) =>
  score >= 75 ? '#1ab87a' : score >= 50 ? '#f5703a' : '#f87171'

const AIJobMatches = () => {
  const navigate = useNavigate()
  const { scrapedJobs, profile } = useOnboardingStore()

  const topJobs = scrapedJobs
    .filter(j => j.source === 'LinkedIn' || j.source === 'Internshala' || j.source === 'Naukri')
    .slice(0, 3)

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (topJobs.length === 0) {
    return (
      <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px] mb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#f5703a]" />
            <div>
              <h2 className="text-[12px] font-medium text-white">AI job matches</h2>
              <p className="text-[10px] text-[#555] mt-0.5">Recommended based on your profile</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="w-10 h-10 rounded-full bg-[#f5703a]/10 flex items-center justify-center mx-auto mb-3">
            <Briefcase size={20} className="text-[#f5703a]" />
          </div>
          <p className="text-[11px] text-[#555] mb-3">
            {profile.resumeAnalyzed
              ? 'Analyse your resume to find matching jobs from LinkedIn, Internshala & Naukri'
              : 'Upload your resume to get AI-powered job matches'}
          </p>
          <button
            onClick={() => navigate('/resume-analyzer')}
            className="px-4 py-2 bg-[#f5703a] hover:bg-[#ff8350] text-white text-[10px] font-medium rounded-lg transition-colors"
          >
            {profile.resumeAnalyzed ? 'Find Jobs' : 'Upload Resume'}
          </button>
        </div>
      </div>
    )
  }

  // ── Job cards ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px] mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#f5703a]" />
          <div>
            <h2 className="text-[12px] font-medium text-white">AI job matches</h2>
            <p className="text-[10px] text-[#555] mt-0.5">
              Top picks from {[...new Set(topJobs.map(j => j.source))].join(', ')}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/jobs')}
          className="text-[10px] text-[#f5703a] hover:text-[#ff8350] transition-colors font-medium"
        >
          View all →
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3">
        {topJobs.map((job) => {
          const color = avatarColor(job.company)
          const barColor = matchBarColor(job.matchScore)
          const isRemote = job.location?.toLowerCase().includes('remote') ||
                           job.location?.toLowerCase().includes('wfh')

          return (
            <div
              key={job.id}
              className="bg-[#0d0d0d] border border-[#242424] rounded-[10px] p-3 hover:border-[#333] transition-all flex flex-col"
            >
              {/* Top row: avatar + title + bookmark */}
              <div className="flex items-start gap-2 mb-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                  style={{ backgroundColor: color + '22', border: `1px solid ${color}44`, color }}
                >
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[11px] font-semibold text-white leading-tight line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="text-[10px] text-[#666] mt-0.5 truncate">{job.company}</p>
                </div>
                <button className="text-[#444] hover:text-[#f5703a] transition-colors flex-shrink-0 mt-0.5">
                  <Bookmark size={13} />
                </button>
              </div>

              {/* Source badge */}
              <div className="mb-2.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold border ${sourceBadge(job.source)}`}>
                  {job.source}
                </span>
                {isRemote && (
                  <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold bg-[#1ab87a]/10 text-[#1ab87a] border border-[#1ab87a]/20">
                    Remote
                  </span>
                )}
              </div>

              {/* Match score bar */}
              <div className="mb-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] text-[#555] flex items-center gap-1">
                    <Zap size={9} /> Match score
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: barColor }}>
                    {job.matchScore}%
                  </span>
                </div>
                <div className="h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${job.matchScore}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>

              {/* Matching skills */}
              {job.matchingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {job.matchingSkills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-1.5 py-0.5 bg-[#1ab87a]/10 text-[#1ab87a] border border-[#1ab87a]/20 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.matchingSkills.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#555] rounded">
                      +{job.matchingSkills.length - 3}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mb-2.5" />
              )}

              {/* Location */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <MapPin size={10} className="text-[#555] flex-shrink-0" />
                <span className="text-[10px] text-[#888] truncate">
                  {job.location || 'India'}
                </span>
              </div>

              {/* Salary if present */}
              {job.salary && (
                <div className="text-[10px] text-[#1ab87a] font-semibold mb-2.5">
                  {job.salary}
                </div>
              )}

              {/* CTA — pushes to bottom */}
              <div className="mt-auto">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-8 bg-[#f5703a] hover:bg-[#ff8350] text-white text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Apply Now <ExternalLink size={10} />
                  </a>
                ) : (
                  <button
                    onClick={() => navigate('/jobs')}
                    className="w-full h-8 bg-[#f5703a]/10 hover:bg-[#f5703a]/20 text-[#f5703a] text-[10px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-[#f5703a]/20"
                  >
                    View on Jobs
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AIJobMatches
