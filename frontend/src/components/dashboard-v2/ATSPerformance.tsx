import { useEffect, useRef } from 'react'

interface ATSPerformanceProps {
  score: number
}

const ATSPerformance = ({ score }: ATSPerformanceProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 56
    const centerX = size / 2
    const centerY = size / 2
    const radius = 22
    const lineWidth = 6

    canvas.width = size
    canvas.height = size

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = lineWidth
    ctx.stroke()

    // Progress circle
    const progress = score / 100
    const endAngle = -Math.PI / 2 + progress * Math.PI * 2

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle)
    ctx.strokeStyle = '#f5703a'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [score])

  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px] mb-3">
      <h3 className="text-[12px] font-medium text-white mb-3">ATS Performance</h3>
      
      <div className="flex items-center gap-3 mb-4">
        {/* Ring Chart */}
        <div className="relative">
          <canvas ref={canvasRef} className="w-14 h-14" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[14px] font-medium text-white">{score}</span>
          </div>
        </div>
        
        {/* Text */}
        <div className="flex-1">
          <h4 className="text-[11px] font-medium text-white mb-1">Resume Score</h4>
          <p className="text-[10px] text-[#555] leading-relaxed">
            Your resume is performing well. Consider optimizing for missing keywords.
          </p>
        </div>
      </div>

      {/* Button */}
      <button className="w-full h-8 bg-[#f5703a] hover:bg-[#ff8350] text-white text-[10px] font-medium rounded transition-colors">
        Analyze resume
      </button>
    </div>
  )
}

export default ATSPerformance
