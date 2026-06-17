import { motion } from 'framer-motion'
import { useState } from 'react'
import { Sparkles, Send, Mic, ArrowRight } from 'lucide-react'

const suggestions = [
  "Review my resume for Tech Lead roles",
  "Prepare me for a Product Manager interview",
  "What salary should I expect as Senior Engineer?",
  "How can I improve my LinkedIn profile?"
]

const AICareerCopilot = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Career Copilot. I can help you optimize your resume, prepare for interviews, suggest career moves, and answer any job search questions. What would you like to work on today?"
    }
  ])

  const handleSend = () => {
    if (!input.trim()) return
    
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm analyzing your request and will provide detailed insights in just a moment..."
      }])
    }, 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl overflow-hidden h-[600px] flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-dark-border/50 bg-gradient-to-r from-dark-accent/5 to-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-dark-accent to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">AI Career Copilot</h3>
            <p className="text-xs text-dark-text-secondary">Your intelligent career assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.role === 'user'
                ? 'bg-dark-accent text-white rounded-2xl rounded-br-md'
                : 'bg-dark-bg/50 text-dark-text-primary rounded-2xl rounded-bl-md'
            } px-4 py-3`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 mt-6">
            <p className="text-xs text-dark-text-secondary mb-2">Try asking:</p>
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setInput(suggestion)}
                className="text-left text-sm text-dark-text-secondary hover:text-white bg-dark-bg/30 hover:bg-dark-bg/50 border border-dark-border/50 hover:border-dark-accent/30 rounded-xl px-4 py-3 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span>{suggestion}</span>
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-dark-border/50 bg-dark-bg/30">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your career..."
            className="flex-1 bg-dark-bg border border-dark-border rounded-2xl px-4 py-3 text-sm text-white placeholder-dark-text-secondary focus:outline-none focus:border-dark-accent transition-colors"
          />
          <button className="p-3 bg-dark-bg border border-dark-border hover:border-dark-accent rounded-2xl transition-colors">
            <Mic size={18} className="text-dark-text-secondary hover:text-dark-accent" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-dark-accent hover:bg-dark-accent-hover disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-colors"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AICareerCopilot
