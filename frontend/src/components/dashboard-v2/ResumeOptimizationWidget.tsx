import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import { useOptimizationStore } from '../../store/optimizationStore'

const ResumeOptimizationWidget = () => {
  const navigate = useNavigate()
  const { versions, currentResult } = useOptimizationStore()

  const bestAts = versions.length > 0 ? Math.max(...versions.map(v => v.ats_after || 0)) : currentResult?.atsAfter || 0
  const currentAts = versions.length > 0 ? (versions[0]?.ats_before || 0) : currentResult?.atsBefore || 0
  const avgImprovement = versions.length > 0
    ? Math.round(versions.reduce((sum, v) => sum + ((v.ats_after || 0) - (v.ats_before || 0)), 0) / versions.length)
    : currentResult ? currentResult.atsAfter - currentResult.atsBefore : 0
  const mostOptimizedCompany = versions.length > 0
    ? versions.reduce((acc, v) => { acc[v.company_name] = (acc[v.company_name] || 0) + 1; return acc }, {} as Record<string, number>)
    : {}
  const topCompany = Object.entries(mostOptimizedCompany).sort((a, b) => b[1] - a[1])[0]?.[0]

  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-[26px] h-[26px] rounded flex items-center justify-center bg-[#f5703a]/10">
            <Sparkles size={14} className="text-[#f5703a]" />
          </div>
          <div>
            <h3 className="text-[12px] font-medium text-white">Resume Optimization</h3>
            <p className="text-[10px] text-[#555]">{versions.length} version{versions.length !== 1 ? 's' : ''} created</p>
          </div>
        </div>
        <button onClick={() => navigate('/optimize')}
          className="text-[10px] text-[#f5703a] hover:text-[#ff8350] transition-colors font-medium flex items-center gap-1">
          View all <ArrowRight size={10} />
        </button>
      </div>

      {versions.length === 0 && !currentResult ? (
        <div className="text-center py-4">
          <p className="text-[10px] text-[#555] mb-3">Optimize your resume for specific jobs to improve ATS score</p>
          <button onClick={() => navigate('/jobs')}
            className="w-full h-8 bg-[#f5703a] hover:bg-[#ff8350] text-white text-[10px] font-medium rounded transition-colors">
            Find Jobs to Optimize For
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Current ATS', value: currentAts || '—', color: '#f87171' },
              { label: 'Best ATS',    value: bestAts || '—',    color: '#4ade80' },
              { label: 'Avg Improvement', value: avgImprovement ? `+${avgImprovement}` : '—', color: '#f5703a' },
              { label: 'Versions',   value: versions.length,    color: '#4a9ef5' },
            ].map(s => (
              <div key={s.label} className="p-2.5 bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg">
                <p className="text-[9px] text-[#444] uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-[16px] font-medium" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {topCompany && (
            <div className="flex items-center gap-2 mb-3 p-2 bg-[#0e0e0e] border border-[#1e1e1e] rounded-lg">
              <TrendingUp size={12} className="text-[#f5703a]" />
              <p className="text-[10px] text-[#888]">Most optimized: <span className="text-white">{topCompany}</span></p>
            </div>
          )}

          <button onClick={() => navigate('/optimize')}
            className="w-full h-8 bg-transparent border border-[#242424] hover:border-[#333] text-[#ccc] text-[10px] font-medium rounded transition-colors flex items-center justify-center gap-1.5">
            <Sparkles size={11} /> View Optimizations
          </button>
        </>
      )}
    </div>
  )
}

export default ResumeOptimizationWidget
