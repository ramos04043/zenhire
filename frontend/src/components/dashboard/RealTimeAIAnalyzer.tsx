import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Activity, TrendingUp, TrendingDown, Sparkles, 
  Eye, Download, Star, Target, Zap, AlertCircle,
  CheckCircle2, Clock, Brain, BarChart3
} from 'lucide-react'

interface AnalysisMetric {
  id: string
  label: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'critical'
  icon: any
}

interface AIInsight {
  id: string
  type: 'success' | 'warning' | 'info' | 'critical'
  message: string
  timestamp: Date
  action?: string
}

const RealTimeAIAnalyzer = () => {
  const [metrics, setMetrics] = useState<AnalysisMetric[]>([
    { id: '1', label: 'Profile Views', value: 127, change: 15, trend: 'up', status: 'good', icon: Eye },
    { id: '2', label: 'ATS Score', value: 85, change: 12, trend: 'up', status: 'good', icon: Target },
    { id: '3', label: 'Match Quality', value: 92, change: 8, trend: 'up', status: 'good', icon: Star },
    { id: '4', label: 'Response Rate', value: 68, change: -5, trend: 'down', status: 'warning', icon: Activity },
    { id: '5', label: 'Resume Downloads', value: 23, change: 10, trend: 'up', status: 'good', icon: Download },
    { id: '6', label: 'Application Speed', value: 45, change: 0, trend: 'stable', status: 'warning', icon: Zap }
  ])

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'success',
      message: 'Your profile received 12 new views from tech recruiters in the last hour',
      timestamp: new Date(),
      action: 'View Profiles'
    },
    {
      id: '2',
      type: 'info',
      message: 'AI detected 3 new job matches above 90% compatibility',
      timestamp: new Date(Date.now() - 300000),
      action: 'See Jobs'
    },
    {
      id: '3',
      type: 'warning',
      message: 'Resume optimization available - potential 15% ATS score increase',
      timestamp: new Date(Date.now() - 600000),
      action: 'Optimize Now'
    }
  ])

  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with random changes
      setMetrics(prev => prev.map(metric => {
        const randomChange = Math.random() > 0.5 ? 1 : -1
        const newValue = Math.max(0, Math.min(100, metric.value + randomChange))
        const change = ((newValue - metric.value) / metric.value * 100).toFixed(1)
        
        return {
          ...metric,
          value: newValue,
          change: parseFloat(change),
          trend: newValue > metric.value ? 'up' : newValue < metric.value ? 'down' : 'stable',
          status: newValue >= 80 ? 'good' : newValue >= 60 ? 'warning' : 'critical'
        }
      }))

      setLastUpdate(new Date())

      // Occasionally add new insights
      if (Math.random() > 0.7) {
        const newInsight: AIInsight = {
          id: Date.now().toString(),
          type: ['success', 'info', 'warning'][Math.floor(Math.random() * 3)] as any,
          message: [
            'New recruiter from Google viewed your profile',
            'Your resume matches a newly posted Senior role at 94%',
            'Consider adding "TypeScript" to improve match rate by 8%',
            'Interview scheduled for tomorrow - preparation guide ready',
            'Your application response rate is above average'
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date(),
          action: ['View', 'See Details', 'Learn More'][Math.floor(Math.random() * 3)]
        }
        setInsights(prev => [newInsight, ...prev].slice(0, 5))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'green'
      case 'warning': return 'yellow'
      case 'critical': return 'red'
      default: return 'gray'
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'green'
      case 'warning': return 'yellow'
      case 'info': return 'blue'
      case 'critical': return 'red'
      default: return 'gray'
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle2
      case 'warning': return AlertCircle
      case 'info': return Sparkles
      case 'critical': return AlertCircle
      default: return Activity
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-dark-border/50 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <Brain size={20} className="text-white" />
              </div>
              {isAnalyzing && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-dark-card" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                Real-Time AI Analyzer
                <Sparkles size={16} className="text-purple-400" />
              </h3>
              <p className="text-xs text-dark-text-secondary">
                Live career intelligence • Updated {new Date(lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-green-500">Active</span>
          </div>
        </div>
      </div>

      {/* Real-Time Metrics Grid */}
      <div className="p-6 border-b border-dark-border/50">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-purple-400" />
          <h4 className="text-sm font-semibold text-white">Live Metrics</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            const color = getStatusColor(metric.status)
            const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : Activity

            return (
              <motion.div
                key={metric.id}
                layout
                className={`relative bg-dark-bg/50 border border-${color}-500/20 rounded-2xl p-4 hover:border-${color}-500/40 transition-all overflow-hidden group`}
              >
                {/* Pulse animation on update */}
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`absolute inset-0 bg-${color}-500/10 rounded-2xl`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <Icon size={18} className={`text-${color}-500`} />
                    <TrendIcon size={14} className={`text-${color}-500 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <div className="mb-1">
                    <motion.span
                      key={metric.value}
                      initial={{ scale: 1.2, color: '#FF6B00' }}
                      animate={{ scale: 1, color: '#FFFFFF' }}
                      className="text-2xl font-bold text-white"
                    >
                      {metric.value}
                    </motion.span>
                    {metric.change !== 0 && (
                      <span className={`ml-2 text-xs font-bold text-${color}-500`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-dark-text-secondary">{metric.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* AI Insights Feed */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-purple-400" />
          <h4 className="text-sm font-semibold text-white">AI Insights</h4>
          <div className="flex-1" />
          <span className="text-xs text-dark-text-secondary">{insights.length} active</span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          <AnimatePresence>
            {insights.map((insight) => {
              const Icon = getInsightIcon(insight.type)
              const color = getInsightColor(insight.type)

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  className={`bg-${color}-500/5 border border-${color}-500/20 rounded-2xl p-4 hover:border-${color}-500/40 transition-all`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 bg-${color}-500/10 rounded-xl flex-shrink-0`}>
                      <Icon size={16} className={`text-${color}-500`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white leading-relaxed mb-2">
                        {insight.message}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-dark-text-secondary">
                          {new Date(insight.timestamp).toLocaleTimeString()}
                        </span>
                        {insight.action && (
                          <>
                            <span className="w-1 h-1 bg-dark-border rounded-full" />
                            <button className={`text-xs font-semibold text-${color}-500 hover:text-${color}-400 transition-colors`}>
                              {insight.action} →
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="p-6 bg-dark-bg/30 border-t border-dark-border/50">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-purple-400" />
              <span className="text-xs font-semibold text-white">Next Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-dark-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
              <span className="text-xs text-dark-text-secondary">3s</span>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <Sparkles size={14} />
            Deep Analysis
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default RealTimeAIAnalyzer
