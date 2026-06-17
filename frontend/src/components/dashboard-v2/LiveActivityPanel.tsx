import { Activity, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const LiveActivityPanel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [liveCount, setLiveCount] = useState(127)
  const [stats, setStats] = useState({
    avg: 42,
    peak: 89,
    trend: '+12%'
  })
  const dataPoints = useRef<number[]>(Array(20).fill(40))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    updateSize()

    // Random walk function
    const updateData = () => {
      const lastValue = dataPoints.current[dataPoints.current.length - 1]
      const change = (Math.random() - 0.5) * 10
      const newValue = Math.max(20, Math.min(90, lastValue + change))
      
      dataPoints.current = [...dataPoints.current.slice(1), newValue]
      
      // Update stats
      const avg = Math.round(dataPoints.current.reduce((a, b) => a + b) / dataPoints.current.length)
      const peak = Math.round(Math.max(...dataPoints.current))
      const trend = newValue > lastValue ? `+${Math.abs((newValue - lastValue)).toFixed(0)}%` : `-${Math.abs((newValue - lastValue)).toFixed(0)}%`
      
      setStats({ avg, peak, trend })
      setLiveCount(Math.round(newValue + 80))
    }

    // Draw chart
    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const padding = 20
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2

      ctx.clearRect(0, 0, width, height)

      const points = dataPoints.current.map((value, index) => ({
        x: padding + (index / (dataPoints.current.length - 1)) * chartWidth,
        y: padding + chartHeight - (value / 100) * chartHeight
      }))

      // Draw filled area
      ctx.beginPath()
      ctx.moveTo(padding, padding + chartHeight)
      points.forEach(point => ctx.lineTo(point.x, point.y))
      ctx.lineTo(padding + chartWidth, padding + chartHeight)
      ctx.closePath()
      ctx.fillStyle = 'rgba(26, 184, 122, 0.08)'
      ctx.fill()

      // Draw line
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      points.slice(1).forEach(point => ctx.lineTo(point.x, point.y))
      ctx.strokeStyle = '#1ab87a'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw points
      points.forEach((point, idx) => {
        ctx.beginPath()
        ctx.arc(point.x, point.y, idx === points.length - 1 ? 4 : 2, 0, Math.PI * 2)
        ctx.fillStyle = '#1ab87a'
        ctx.fill()
      })
    }

    const interval = setInterval(() => {
      updateData()
      draw()
    }, 1200)

    draw()

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px] flex flex-col aspect-square">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2">
          <div className="w-[26px] h-[26px] rounded flex items-center justify-center bg-[#1ab87a]/10">
            <Activity size={14} className="text-[#1ab87a]" />
          </div>
          <div>
            <h3 className="text-[12px] font-medium text-white">Live activity</h3>
            <p className="text-[10px] text-[#555] mt-0.5">Real-time engagement tracking</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[14px] font-medium text-white mb-1">{liveCount}</div>
          <div className="flex items-center gap-1 text-[#1ab87a]">
            <span className="text-[9px] font-medium">Active</span>
            <TrendingUp size={10} />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative min-h-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between pt-3 border-t border-[#242424] mt-3">
        <div className="text-center flex-1">
          <div className="text-[10px] text-[#555] mb-0.5">Avg</div>
          <div className="text-[12px] font-medium text-white">{stats.avg}</div>
        </div>
        <div className="w-[1px] h-6 bg-[#242424]" />
        <div className="text-center flex-1">
          <div className="text-[10px] text-[#555] mb-0.5">Peak</div>
          <div className="text-[12px] font-medium text-white">{stats.peak}</div>
        </div>
        <div className="w-[1px] h-6 bg-[#242424]" />
        <div className="text-center flex-1">
          <div className="text-[10px] text-[#555] mb-0.5">Trend</div>
          <div className="text-[12px] font-medium text-[#1ab87a]">{stats.trend}</div>
        </div>
      </div>
    </div>
  )
}

export default LiveActivityPanel
