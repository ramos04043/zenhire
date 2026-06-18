import { motion } from 'framer-motion'
import { 
  TrendingUp, CheckCircle2, Clock,
  Sparkles, Target, BarChart3, Calendar 
} from 'lucide-react'

const DashboardPreview = () => {
  return (
    <div className="relative">
      {/* Main Dashboard Card */}
      <motion.div 
        className="relative bg-dark-card/80 backdrop-blur-2xl border border-dark-border rounded-3xl p-8 shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow Effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-dark-accent/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Applications Dashboard</h3>
            <p className="text-dark-text-secondary">Track your journey in real-time</p>
          </div>
          <div className="px-4 py-2 bg-dark-accent/10 border border-dark-accent/20 rounded-xl">
            <span className="text-dark-accent font-bold">Live</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active', value: '12', icon: Clock, color: 'blue' },
            { label: 'Interview', value: '5', icon: Calendar, color: 'purple' },
            { label: 'Offer', value: '2', icon: CheckCircle2, color: 'green' },
            { label: 'ATS Score', value: '94%', icon: Target, color: 'orange' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-dark-bg/50 backdrop-blur-xl border border-dark-border rounded-2xl p-4 hover:border-dark-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={20} className={`text-${stat.color}-400`} />
                <TrendingUp size={14} className="text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-dark-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Application Cards */}
        <div className="relative space-y-3">
          {[
            { 
              company: 'Google', 
              role: 'Senior Product Designer', 
              status: 'Interview Scheduled',
              statusColor: 'purple',
              ats: 96,
              date: '2 days ago'
            },
            { 
              company: 'Microsoft', 
              role: 'UX Research Lead', 
              status: 'Under Review',
              statusColor: 'blue',
              ats: 94,
              date: '5 days ago'
            },
            { 
              company: 'Meta', 
              role: 'Product Manager', 
              status: 'AI Optimized',
              statusColor: 'green',
              ats: 98,
              date: '1 week ago'
            }
          ].map((app, i) => (
            <motion.div
              key={app.company}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-dark-bg/30 backdrop-blur-xl border border-dark-border rounded-2xl p-5 hover:border-dark-accent/30 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-dark-card rounded-xl flex items-center justify-center border border-dark-border">
                    <span className="text-xl font-bold">{app.company[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-dark-accent transition-colors">
                      {app.role}
                    </h4>
                    <p className="text-sm text-dark-text-secondary">{app.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${app.statusColor}-500/10 border border-${app.statusColor}-500/20 rounded-lg mb-2`}>
                    <span className={`text-xs font-semibold text-${app.statusColor}-400`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <Target size={14} className="text-dark-accent" />
                    <span className="text-sm font-bold text-dark-accent">{app.ats}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating AI Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -top-6 -right-6 bg-dark-card/90 backdrop-blur-2xl border border-dark-accent/30 rounded-2xl p-4 shadow-glow animate-float hidden lg:block"
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={20} className="text-dark-accent" />
          <span className="font-bold text-white">AI Insights</span>
        </div>
        <p className="text-sm text-dark-text-secondary max-w-xs">
          Your resume matches 96% with this role. Add "Agile Leadership" to boost to 98%.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute -bottom-6 -left-6 bg-dark-card/90 backdrop-blur-2xl border border-dark-border rounded-2xl p-4 shadow-xl animate-float hidden lg:block"
        style={{ animationDelay: '1s' }}
      >
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 size={20} className="text-green-400" />
          <span className="font-bold text-white">Success Rate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-3xl font-bold text-green-400">94%</div>
          <TrendingUp size={16} className="text-green-400" />
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPreview
