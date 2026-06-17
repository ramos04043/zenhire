import DashboardLayout from '../components/DashboardLayout'
import { MessageSquare, Send, Star } from 'lucide-react'

const Feedback = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Send Feedback</h1>
            <p className="text-gray-400">Help us improve ZenHire with your suggestions</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">How satisfied are you with ZenHire?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className="p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors"
                    >
                      <Star className="text-gray-400" size={24} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Feedback Category</label>
                <select className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg focus:border-[#6366f1] focus:outline-none">
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>General Feedback</option>
                  <option>Improvement Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Feedback</label>
                <textarea
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:border-[#6366f1] focus:outline-none"
                  rows={6}
                  placeholder="Tell us what you think..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email (optional)</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:border-[#6366f1] focus:outline-none"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">We'll only use this to follow up if needed</p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium">
                <Send size={18} />
                <span>Submit Feedback</span>
              </button>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="text-blue-400 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-white font-bold mb-2">Thank you for your feedback!</h3>
                <p className="text-gray-400 text-sm">
                  Your input helps us make ZenHire better for everyone. We read every piece of feedback carefully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Feedback
