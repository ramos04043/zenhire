import { Circle } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'

const RecentActivityPipeline = () => {
  const applications = useDataStore(s => s.applications)
  const notifications = useDataStore(s => s.notifications)

  // Build activity from real notifications + applications
  const recentActivities = [
    ...notifications.slice(0, 3).map(n => ({
      id: n.id,
      text: n.message,
      timestamp: new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      color: n.type === 'resume_upload' ? '#4a9ef5' : n.type === 'status_change' ? '#1ab87a' : '#f5703a',
    })),
    ...applications.slice(0, 2).map(a => ({
      id: a.id,
      text: `Applied to ${a.position} at ${a.company}`,
      timestamp: new Date(a.applied_date || a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      color: '#f5703a',
    })),
  ].slice(0, 4)

  const fallbackActivities = [
    { id: '1', text: 'Upload your resume to get started', timestamp: 'Now', color: '#f5703a' },
    { id: '2', text: 'Complete your career profile', timestamp: '', color: '#4a9ef5' },
    { id: '3', text: 'Browse AI-matched job listings', timestamp: '', color: '#7c6be8' },
  ]

  const activities = recentActivities.length > 0 ? recentActivities : fallbackActivities

  // Pipeline from real application statuses
  const statusCounts = {
    Applied: applications.filter(a => a.status === 'applied').length,
    Screening: applications.filter(a => a.status === 'viewed').length,
    Interview: applications.filter(a => a.status === 'interview').length,
    Offer: applications.filter(a => a.status === 'offer').length,
  }
  const maxCount = Math.max(...Object.values(statusCounts), 1)

  const pipelineStages = [
    { label: 'Applied',    count: statusCounts.Applied,   color: '#4a9ef5' },
    { label: 'Screening',  count: statusCounts.Screening,  color: '#7c6be8' },
    { label: 'Interview',  count: statusCounts.Interview,  color: '#f5703a' },
    { label: 'Offer',      count: statusCounts.Offer,      color: '#1ab87a' },
  ]

  return (
    <div className="bg-[#161616] border border-[#242424] rounded-[11px] p-[14px] h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-[12px] font-medium text-white mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div key={activity.id} className="flex gap-2.5">
              <div className="flex flex-col items-center">
                <Circle size={8} fill={activity.color} style={{ color: activity.color }} className="flex-shrink-0" />
                {idx < activities.length - 1 && <div className="w-[1px] flex-1 bg-[#242424] mt-1" />}
              </div>
              <div className="flex-1 pb-1">
                <p className="text-[11px] text-[#ccc] leading-relaxed">{activity.text}</p>
                {activity.timestamp && <p className="text-[10px] text-[#555] mt-1">{activity.timestamp}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#242424] my-4" />

      <div className="flex-1">
        <h3 className="text-[12px] font-medium text-white mb-3">Pipeline</h3>
        <div className="space-y-3">
          {pipelineStages.map(stage => (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#ccc]">{stage.label}</span>
                <span className="text-[10px] font-medium text-white">{stage.count}</span>
              </div>
              <div className="h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className="h-full transition-all" style={{ width: `${(stage.count / maxCount) * 100}%`, backgroundColor: stage.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentActivityPipeline
