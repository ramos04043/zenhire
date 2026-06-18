import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Bell, Plus, Search, MapPin, Briefcase, DollarSign, Clock, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

const JobAlerts = () => {
  const [_showCreateModal, setShowCreateModal] = useState(false)

  const alerts = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      keywords: 'React, TypeScript, Next.js',
      location: 'Remote',
      salary: '$120k - $180k',
      frequency: 'Daily',
      active: true,
      matchesFound: 12,
      lastNotified: '2 hours ago',
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      keywords: 'Node.js, PostgreSQL, AWS',
      location: 'San Francisco, CA',
      salary: '$150k+',
      frequency: 'Instant',
      active: true,
      matchesFound: 8,
      lastNotified: '1 day ago',
    },
    {
      id: 3,
      title: 'DevOps Engineer',
      keywords: 'Kubernetes, Docker, CI/CD',
      location: 'New York, NY',
      salary: '$130k - $170k',
      frequency: 'Weekly',
      active: false,
      matchesFound: 0,
      lastNotified: 'Never',
    },
  ]

  const recentMatches = [
    {
      id: 1,
      alertTitle: 'Senior Frontend Developer',
      jobTitle: 'Senior React Developer at Google',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$160k - $200k',
      postedAt: '1 hour ago',
      matchScore: 95,
    },
    {
      id: 2,
      alertTitle: 'Full Stack Engineer',
      jobTitle: 'Full Stack Engineer at Stripe',
      company: 'Stripe',
      location: 'San Francisco, CA',
      salary: '$170k - $220k',
      postedAt: '3 hours ago',
      matchScore: 92,
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Job Alerts</h1>
              <p className="text-gray-400">Get notified when jobs matching your criteria are posted</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
            >
              <Plus size={20} />
              <span>Create Alert</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Active Alerts</span>
                <Bell className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{alerts.filter(a => a.active).length}</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Matches</span>
                <Search className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {alerts.reduce((sum, a) => sum + a.matchesFound, 0)}
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">New Today</span>
                <Clock className="text-purple-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">5</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Applied</span>
                <Briefcase className="text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">3</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Active Alerts */}
            <div className="col-span-2 space-y-6">
              <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Your Alerts</h2>
                
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-bold">{alert.title}</h3>
                            {alert.active ? (
                              <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs font-medium rounded">
                                Paused
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{alert.keywords}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{alert.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>{alert.salary}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bell size={14} />
                              <span>{alert.frequency}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-[#222222] rounded-lg transition-colors">
                            <Edit2 className="text-gray-400" size={16} />
                          </button>
                          <button className="p-2 hover:bg-[#222222] rounded-lg transition-colors">
                            <Trash2 className="text-gray-400" size={16} />
                          </button>
                          <button className="p-2 hover:bg-[#222222] rounded-lg transition-colors">
                            {alert.active ? (
                              <ToggleRight className="text-[#6366f1]" size={20} />
                            ) : (
                              <ToggleLeft className="text-gray-400" size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            <span className="font-bold text-white">{alert.matchesFound}</span> matches found
                          </span>
                          <span className="text-gray-500">Last notified: {alert.lastNotified}</span>
                        </div>
                        <button className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors text-sm font-medium">
                          View Matches
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Matches */}
            <div className="space-y-6">
              <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Recent Matches</h2>
                
                <div className="space-y-3">
                  {recentMatches.map(match => (
                    <div
                      key={match.id}
                      className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs text-[#6366f1] font-medium mb-1">{match.alertTitle}</p>
                          <h3 className="text-white font-bold text-sm mb-1">{match.jobTitle}</h3>
                          <p className="text-sm text-gray-400">{match.company}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded">
                          {match.matchScore}%
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <MapPin size={12} />
                        <span>{match.location}</span>
                        <span>•</span>
                        <span>{match.salary}</span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                        <span className="text-xs text-gray-500">{match.postedAt}</span>
                        <button className="px-3 py-1.5 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded text-xs font-medium transition-colors">
                          View Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors font-medium">
                  View All Matches
                </button>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-white font-bold mb-3">💡 Pro Tips</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Use specific keywords for better matches</li>
                  <li>• Set instant alerts for hot opportunities</li>
                  <li>• Adjust salary range for more results</li>
                  <li>• Monitor alert performance weekly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobAlerts
