import { motion } from 'framer-motion'
import { MapPin, DollarSign, TrendingUp, Sparkles, ExternalLink, Bookmark } from 'lucide-react'
import { useState } from 'react'

interface Job {
  id: string
  title: string
  company: string
  logo: string
  location: string
  salary: string
  remote: boolean
  matchScore: number
  growth: string
  aiReason: string
  skills: string[]
}

const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Product Designer',
    company: 'Google',
    logo: 'G',
    location: 'San Francisco, CA',
    salary: '$160k - $220k',
    remote: true,
    matchScore: 96,
    growth: 'High Growth',
    aiReason: 'Perfect match for your UX background and leadership experience',
    skills: ['Figma', 'Design Systems', 'Leadership']
  },
  {
    id: '2',
    title: 'Lead UX Researcher',
    company: 'Microsoft',
    logo: 'M',
    location: 'Seattle, WA',
    salary: '$150k - $200k',
    remote: false,
    matchScore: 92,
    growth: 'Expanding Team',
    aiReason: 'Your research methodology aligns with their product strategy',
    skills: ['User Research', 'Data Analysis', 'Strategy']
  },
  {
    id: '3',
    title: 'Design Director',
    company: 'OpenAI',
    logo: 'O',
    location: 'Remote',
    salary: '$180k - $250k',
    remote: true,
    matchScore: 94,
    growth: 'Rapid Growth',
    aiReason: 'AI product experience matches their expanding design team needs',
    skills: ['AI/ML', 'Product Design', 'Team Leadership']
  }
]

const SmartJobRecommendations = () => {
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set())

  const toggleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(jobId)) {
        newSet.delete(jobId)
      } else {
        newSet.add(jobId)
      }
      return newSet
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">AI Job Matches</h2>
          <p className="text-sm text-dark-text-secondary">Recommended based on your profile</p>
        </div>
        <button className="px-4 py-2 bg-dark-card border border-dark-border hover:border-dark-accent rounded-2xl text-sm font-semibold text-white transition-all">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-dark-card/50 backdrop-blur-xl border border-dark-border hover:border-dark-accent/50 rounded-3xl overflow-hidden group transition-all"
          >
            {/* Header */}
            <div className="p-6 border-b border-dark-border/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-dark-accent to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-dark-accent transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm text-dark-text-secondary">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSave(job.id)}
                  className="p-2 hover:bg-dark-bg rounded-xl transition-colors"
                >
                  <Bookmark
                    size={20}
                    className={savedJobs.has(job.id) ? 'fill-dark-accent text-dark-accent' : 'text-dark-text-secondary'}
                  />
                </button>
              </div>

              {/* Match Score */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-2 bg-dark-bg rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${job.matchScore}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-bold text-green-500">{job.matchScore}%</span>
              </div>

              {/* AI Reason */}
              <div className="flex items-start gap-2 p-3 bg-dark-bg/50 rounded-2xl">
                <Sparkles size={16} className="text-dark-accent mt-0.5 flex-shrink-0" />
                <p className="text-xs text-dark-text-secondary leading-relaxed">
                  {job.aiReason}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-dark-text-secondary">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                {job.remote && (
                  <div className="px-2 py-1 bg-green-500/10 text-green-500 rounded-lg text-xs font-semibold">
                    Remote
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-dark-text-secondary">
                  <DollarSign size={16} />
                  <span>{job.salary}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-blue-500" />
                <span className="text-dark-text-secondary">{job.growth}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-dark-bg text-dark-text-secondary text-xs rounded-full border border-dark-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action */}
              <button className="w-full py-3 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 group">
                <span>View Details</span>
                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default SmartJobRecommendations
