import { motion } from 'framer-motion'
import { TrendingUp, Award, Zap, ArrowUp, ArrowDown, Briefcase, DollarSign } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const CareerInsights = () => {
  const stats = {
    profileViews: { current: 142, change: 23, trend: 'up' },
    applicationRate: { current: 78, change: 12, trend: 'up' },
    avgResponseTime: { current: 5, change: 2, trend: 'down' },
    interviewRate: { current: 34, change: 5, trend: 'up' }
  }



  const insights = [
    {
      title: 'Best Time to Apply',
      description: 'Applications sent Tuesday-Thursday 9-11 AM have 23% higher response rates',
      icon: Zap,
      color: 'blue'
    },
    {
      title: 'Skill Demand',
      description: 'React and TypeScript skills are trending up 45% in your target companies',
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Salary Insight',
      description: 'Your experience level commands $120k-$150k in San Francisco market',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Profile Strength',
      description: 'Your profile is in the top 15% of candidates in your field',
      icon: Award,
      color: 'yellow'
    }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Career Insights</h1>
            <p className="text-gray-400">AI-powered analytics to optimize your job search</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(stats).map(([key, stat], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className={`flex items-center gap-1 text-sm font-bold ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {stat.change}%
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{stat.current}{key === 'applicationRate' || key === 'interviewRate' ? '%' : ''}</div>
                <p className="text-xs text-gray-500 mt-1">vs last period</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Application Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2 bg-[#111111] border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-lg font-bold text-white mb-6">Application Trend</h2>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Briefcase size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Chart visualization would go here</p>
                </div>
              </div>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {insights.map((insight, index) => {
                const Icon = insight.icon
                const colorClasses = {
                  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                  green: 'bg-green-500/10 border-green-500/20 text-green-400',
                  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                  yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }

                return (
                  <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-3 ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-white mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-400">{insight.description}</p>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CareerInsights
