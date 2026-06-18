import { motion } from 'framer-motion'
import { 
  Target, TrendingUp, Calendar,
  Sparkles, Award, Eye, Zap 
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  gradient: string
  trend?: { value: number; label: string }
  action?: { label: string; path: string }
  size?: 'small' | 'medium' | 'large'
}

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient, 
  trend,
  action,
  size = 'medium'
}: MetricCardProps) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-1 md:col-span-2 row-span-1',
    large: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`${sizeClasses[size]} bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl p-6 group hover:border-dark-accent/30 transition-all overflow-hidden relative`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-dark-text-secondary font-medium mb-1">{title}</p>
            <h3 className="text-4xl font-bold text-white mb-2">{value}</h3>
            {subtitle && (
              <p className="text-xs text-dark-text-secondary">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-2 mb-4">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              trend.value >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              <TrendingUp size={12} className={trend.value < 0 ? 'rotate-180' : ''} />
              <span className="text-xs font-bold">{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
            </div>
            <span className="text-xs text-dark-text-secondary">{trend.label}</span>
          </div>
        )}

        {action && (
          <Link
            to={action.path}
            className="inline-flex items-center gap-2 text-sm font-semibold text-dark-accent hover:text-dark-accent-hover transition-colors"
          >
            {action.label}
            <Sparkles size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

interface CareerCommandCenterProps {
  stats: {
    atsScore: number
    applications: number
    interviews: number
    profileViews: number
    matchScore: number
    skillsOptimized: number
  }
}

const CareerCommandCenter = ({ stats }: CareerCommandCenterProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Career Command Center</h2>
          <p className="text-sm text-dark-text-secondary">Real-time insights into your job search</p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr">
        <MetricCard
          title="ATS Score"
          value={`${stats.atsScore}%`}
          subtitle="Resume compatibility"
          icon={Target}
          gradient="from-orange-500 to-red-500"
          trend={{ value: 12, label: 'vs last week' }}
          action={{ label: 'Optimize Now', path: '/resume' }}
          size="medium"
        />

        <MetricCard
          title="Active Applications"
          value={stats.applications}
          subtitle="Jobs in pipeline"
          icon={Zap}
          gradient="from-blue-500 to-cyan-500"
          size="small"
        />

        <MetricCard
          title="Interviews"
          value={stats.interviews}
          subtitle="Scheduled this week"
          icon={Calendar}
          gradient="from-purple-500 to-pink-500"
          action={{ label: 'Prepare', path: '/applications' }}
          size="small"
        />

        <MetricCard
          title="Profile Views"
          value={stats.profileViews}
          subtitle="Recruiters today"
          icon={Eye}
          gradient="from-green-500 to-emerald-500"
          trend={{ value: 8, label: 'vs yesterday' }}
          size="medium"
        />

        <MetricCard
          title="Top Match"
          value={`${stats.matchScore}%`}
          subtitle="Best job match"
          icon={Award}
          gradient="from-yellow-500 to-orange-500"
          action={{ label: 'View Jobs', path: '/jobs' }}
          size="small"
        />

        <MetricCard
          title="Skills Optimized"
          value={stats.skillsOptimized}
          subtitle="AI improvements"
          icon={Sparkles}
          gradient="from-indigo-500 to-purple-500"
          size="small"
        />
      </div>
    </div>
  )
}

export default CareerCommandCenter
