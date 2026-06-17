import DashboardLayout from '../components/DashboardLayout'
import { Calendar, Clock, MapPin, Video, Building, CheckCircle, AlertCircle } from 'lucide-react'

const Interviews = () => {
  const interviews = [
    {
      id: 1,
      company: 'Google',
      position: 'Senior Frontend Developer',
      date: '2024-02-20',
      time: '10:00 AM',
      type: 'Video Call',
      status: 'Upcoming',
      location: 'Google Meet',
    },
    {
      id: 2,
      company: 'Meta',
      position: 'Full Stack Engineer',
      date: '2024-02-22',
      time: '2:00 PM',
      type: 'On-site',
      status: 'Upcoming',
      location: 'Menlo Park, CA',
    },
    {
      id: 3,
      company: 'Stripe',
      position: 'Frontend Engineer',
      date: '2024-02-15',
      time: '11:00 AM',
      type: 'Phone',
      status: 'Completed',
      location: 'Phone Screen',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Interview Schedule</h1>
            <p className="text-gray-400">Manage your upcoming interviews</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Upcoming</span>
                <Calendar className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {interviews.filter(i => i.status === 'Upcoming').length}
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">This Week</span>
                <Clock className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">3</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Completed</span>
                <CheckCircle className="text-purple-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">8</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Success Rate</span>
                <AlertCircle className="text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">75%</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">All Interviews</h2>
            
            <div className="space-y-3">
              {interviews.map(interview => (
                <div
                  key={interview.id}
                  className={`bg-[#1a1a1a] border rounded-lg p-4 hover:border-gray-700 transition-colors ${
                    interview.status === 'Upcoming' ? 'border-[#6366f1]/30' : 'border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="text-[#6366f1]" size={20} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-bold">{interview.company}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            interview.status === 'Upcoming'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {interview.status}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-3">{interview.position}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{interview.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{interview.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {interview.type === 'Video Call' ? (
                              <Video size={14} />
                            ) : (
                              <MapPin size={14} />
                            )}
                            <span>{interview.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {interview.status === 'Upcoming' && (
                      <button className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium">
                        View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Interviews
