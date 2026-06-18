import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { Brain, Send } from 'lucide-react'

const AICareerCoach = () => {
  const [messages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI Career Coach. How can I help you today?' },
  ])

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Brain className="text-[#6366f1]" />
              AI Career Coach
            </h1>
            <p className="text-gray-400">Get personalized career advice powered by AI</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-lg h-[600px] flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === 'user' 
                      ? 'bg-[#6366f1] text-white' 
                      : 'bg-[#1a1a1a] border border-gray-800 text-gray-300'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything about your career..."
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:border-[#6366f1] focus:outline-none"
                />
                <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors flex items-center gap-2">
                  <Send size={18} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AICareerCoach
