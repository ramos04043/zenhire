import DashboardLayout from '../components/DashboardLayout'
import { Gift, DollarSign, Calendar, CheckCircle, Clock, TrendingUp, Building } from 'lucide-react'

const Offers = () => {
  const offers = [
    {
      id: 1,
      company: 'Google',
      position: 'Senior Frontend Developer',
      salary: '$180,000',
      bonus: '$30,000',
      equity: '$200,000',
      deadline: '2024-02-28',
      status: 'Pending',
    },
    {
      id: 2,
      company: 'Meta',
      position: 'Full Stack Engineer',
      salary: '$190,000',
      bonus: '$40,000',
      equity: '$250,000',
      deadline: '2024-03-05',
      status: 'Accepted',
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Offer Tracker</h1>
            <p className="text-gray-400">Manage and compare your job offers</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Offers</span>
                <Gift className="text-purple-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">{offers.length}</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Pending</span>
                <Clock className="text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {offers.filter(o => o.status === 'Pending').length}
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Accepted</span>
                <CheckCircle className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {offers.filter(o => o.status === 'Accepted').length}
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Avg Salary</span>
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">$185k</p>
            </div>
          </div>

          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer.id} className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                      <Building className="text-[#6366f1]" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{offer.company}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          offer.status === 'Accepted'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-3">{offer.position}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Deadline: {offer.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {offer.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium">
                        Accept
                      </button>
                      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium">
                        Decline
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="text-green-400" size={16} />
                      <span className="text-sm text-gray-400">Base Salary</span>
                    </div>
                    <p className="text-xl font-bold text-white">{offer.salary}</p>
                  </div>

                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="text-blue-400" size={16} />
                      <span className="text-sm text-gray-400">Signing Bonus</span>
                    </div>
                    <p className="text-xl font-bold text-white">{offer.bonus}</p>
                  </div>

                  <div className="bg-[#1a1a1a] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="text-purple-400" size={16} />
                      <span className="text-sm text-gray-400">Equity (4 years)</span>
                    </div>
                    <p className="text-xl font-bold text-white">{offer.equity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Offers
