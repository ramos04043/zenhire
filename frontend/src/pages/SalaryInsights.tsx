import DashboardLayout from '../components/DashboardLayout'
import { DollarSign, TrendingUp, MapPin, Briefcase, BarChart3 } from 'lucide-react'

const SalaryInsights = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Salary Insights</h1>
            <p className="text-gray-400">Market salary data for your role and location</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Average Salary</span>
                <DollarSign className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">$145k</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Market Trend</span>
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">+8%</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Your Position</span>
                <BarChart3 className="text-purple-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">75th</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Top Companies</span>
                <Briefcase className="text-yellow-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white">$180k+</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Salary Range by Location</h2>
            
            <div className="space-y-4">
              {[
                { location: 'San Francisco, CA', range: '$160k - $220k', average: '$185k' },
                { location: 'New York, NY', range: '$150k - $200k', average: '$170k' },
                { location: 'Seattle, WA', range: '$140k - $190k', average: '$160k' },
                { location: 'Austin, TX', range: '$120k - $170k', average: '$140k' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-[#6366f1]" size={20} />
                    <div>
                      <p className="text-white font-medium">{item.location}</p>
                      <p className="text-sm text-gray-400">{item.range}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Average</p>
                    <p className="text-xl font-bold text-white">{item.average}</p>
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

export default SalaryInsights
