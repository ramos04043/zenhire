import { motion } from 'framer-motion'
import { Eye, Download, Star, Calendar, Building2, TrendingUp } from 'lucide-react'

interface Activity {
  id: string
  company: string
  action: 'viewed' | 'downloaded' | 'shortlisted' | 'interview'
  timestamp: string
  recruiter?: string
}

const activities: Activity[] = [
  {
    id: '1',
    company: 'Microsoft',
    action: 'viewed',
    timestamp: '2 minutes ago',
    recruiter: 'Sarah Chen'
  },
  {
    id: '2',
    company: 'Google',
    action: 'downloaded',
    timestamp: '1 hour ago',
    recruiter: 'Michael Park'
  },
  {
    id: '3',
    company: 'OpenAI',
    action: 'shortlisted',
    timestamp: '3 hours ago',
    recruiter: 'Emma Wilson'
  },
  {
    id: '4',
    company: 'Amazon',
    action: 'interview',
    timestamp: 'Today',
    recruiter: 'David Kim'
  },
  {
    id: '5',
    company: 'Meta',
    action: 'viewed',
    timestamp: 'Yesterday',
    recruiter: 'Lisa Anderson'
  }
]

const actionConfig = {
  viewed: {
    icon: Eye,
    color: 'blue',
    label: 'viewed your profile'
  },
  downloaded: {
    icon: Download,
    color: 'green',
    label: 'downloaded your resume'
  },
  shortlisted: {
    icon: Star,
    color: 'yellow',
    label: 'shortlisted your application'
  },
  interview: {
    icon: Calendar,
    color: 'purple',
    label: 'requested an interview'
  }
}

const RecruiterActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-dark-border/50 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Recruiter Activity</h3>
              <p className="text-xs text-dark-text-secondary">Real-time updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-green-500">Live</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-dark-border/30" />

          <div className="space-y-6">
            {activities.map((activity, index) => {
              const config = actionConfig[activity.action]
              const Icon = config.icon

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4 group"
                >
                  {/* Icon */}
                  <div className={`relative z-10 w-12 h-12 bg-${config.color}-500/10 border-2 border-${config.color}-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon size={20} className={`text-${config.color}-500`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          <span className="text-dark-accent">{activity.company}</span> {config.label}
                        </p>
                        {activity.recruiter && (
                          <p className="text-xs text-dark-text-secondary mt-1">
                            by {activity.recruiter}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-dark-text-secondary whitespace-nowrap">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-6 bg-dark-bg/30 border-t border-dark-border/50">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-1">12</p>
            <p className="text-xs text-dark-text-secondary">Views Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-1">5</p>
            <p className="text-xs text-dark-text-secondary">Downloads</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-1">3</p>
            <p className="text-xs text-dark-text-secondary">Shortlisted</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RecruiterActivityFeed
