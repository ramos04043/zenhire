import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Activity, TrendingUp } from 'lucide-react'

interface DataPoint {
  timestamp: number
  value: number
}

const LiveActivityChart = () => {
  const [data, setData] = useState<DataPoint[]>([])
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    // Initialize with some data
    const now = Date.now()
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      timestamp: now - (20 - i) * 3000,
      value: Math.random() * 100
    }))
    setData(initialData)

    // Update data every 3 seconds
    const interval = setInterval(() => {
      const newValue = Math.random() * 100
      setCurrentValue(newValue)
      
      setData(prev => {
        const newData = [
          ...prev.slice(1),
          { timestamp: Date.now(), value: newValue }
        ]
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...data.map(d => d.value), 100)
  const minValue = Math.min(...data.map(d => d.value), 0)
  const range = maxValue - minValue || 1

  // Calculate SVG path
  const width = 600
  const height = 150
  const padding = 20

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((point.value - minValue) / range) * (height - padding * 2)
    return { x, y, value: point.value }
  })

  const pathData = points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `L ${point.x} ${point.y}`
  }).join(' ')

  // Create area path (filled)
  const areaPathData = pathData + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Live Activity</h3>
            <p className="text-xs text-dark-text-secondary">Real-time engagement tracking</p>
          </div>
        </div>
        <div className="text-right">
          <motion.div
            key={currentValue}
            initial={{ scale: 1.2, color: '#FF6B00' }}
            animate={{ scale: 1, color: '#FFFFFF' }}
            className="text-3xl font-bold text-white"
          >
            {currentValue.toFixed(0)}
          </motion.div>
          <div className="flex items-center gap-1 text-xs text-green-500">
            <TrendingUp size={12} />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-dark-bg/30 p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((percent) => {
            const y = height - padding - (percent / 100) * (height - padding * 2)
            return (
              <line
                key={percent}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            )
          })}

          {/* Area fill */}
          <motion.path
            d={areaPathData}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Line path */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#10b981"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <animate
                attributeName="r"
                values="4;6;4"
                dur="2s"
                repeatCount="indefinite"
                begin={`${index * 0.1}s`}
              />
            </motion.circle>
          ))}

          {/* Latest point highlight */}
          {points.length > 0 && (
            <motion.circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="8"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <animate
                attributeName="r"
                values="8;12;8"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.3;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </motion.circle>
          )}
        </svg>

        {/* Time labels */}
        <div className="flex justify-between mt-2 px-4 text-xs text-dark-text-secondary">
          <span>20s ago</span>
          <span>10s ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-dark-bg/30 rounded-xl">
          <p className="text-xs text-dark-text-secondary mb-1">Avg</p>
          <p className="text-lg font-bold text-white">
            {(data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 bg-dark-bg/30 rounded-xl">
          <p className="text-xs text-dark-text-secondary mb-1">Peak</p>
          <p className="text-lg font-bold text-white">
            {Math.max(...data.map(d => d.value)).toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 bg-dark-bg/30 rounded-xl">
          <p className="text-xs text-dark-text-secondary mb-1">Trend</p>
          <p className="text-lg font-bold text-green-500 flex items-center justify-center gap-1">
            <TrendingUp size={16} />
            +{((currentValue / Math.max(...data.map(d => d.value)) * 100) || 0).toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  )
}

export default LiveActivityChart
