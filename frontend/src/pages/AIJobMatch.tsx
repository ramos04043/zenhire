import DashboardLayout from '../components/DashboardLayout'
import { Sparkles, TrendingUp, MapPin, DollarSign } from 'lucide-react'

const AIJobMatch = () => {
  const matches = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$150k - $200k',
      matchScore: 95,
      reasons: ['React expert', 'TypeScript skills', 'Leadership experience'],
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA',
      salary: '$160k - $220k',
      matchScore: 92,
      reasons: ['Full-stack experience', 'Payment systems', 'API design'],
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="text-[#6366f1]" />
              AI Job Match
            </h1>
            <p className="text-gray-400">Jobs perfectly matched to your profile using AI</p>
          </div>

          <div className="space-y-4">
            {matches.map(match => (
              <div key={match.id} className="bg-[#111111] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{match.title}</h3>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-bold flex items-center gap-1">
                        <TrendingUp size={14} />
                        {match.matchScore}% Match
                      </span>
                    </div>
                    <p className="text-lg text-gray-300 mb-3">{match.company}</p>
                    
                    <div className="flex items-center gap-4 text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{match.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} />
                        <span>{match.salary}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {match.reasons.map((reason, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-full text-sm border border-[#6366f1]/20">
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AIJobMatch
