import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Send, Paperclip, MoreVertical, User, Circle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState('')

  const chats = [
    {
      id: '1',
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      role: 'Senior Recruiter',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff',
      lastMessage: 'Thanks for your application! We\'d love to schedule an interview.',
      time: '10m ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      company: 'StartupX',
      role: 'Hiring Manager',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff',
      lastMessage: 'Your profile looks great! Let\'s connect.',
      time: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: '3',
      name: 'Emily Davis',
      company: 'DesignHub',
      role: 'HR Coordinator',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=f59e0b&color=fff',
      lastMessage: 'We received your application.',
      time: '2d ago',
      unread: 0,
      online: false
    }
  ]

  const messages = selectedChat ? [
    { id: '1', sender: 'them', text: 'Hi! Thanks for applying to our Senior Developer position.', time: '2:30 PM' },
    { id: '2', sender: 'me', text: 'Thank you for reaching out! I\'m very interested in the position.', time: '2:32 PM' },
    { id: '3', sender: 'them', text: 'Great! Your experience with React and Node.js is impressive.', time: '2:35 PM' },
    { id: '4', sender: 'them', text: 'Would you be available for a quick call this week?', time: '2:36 PM' },
    { id: '5', sender: 'me', text: 'Absolutely! I\'m available Thursday or Friday afternoon.', time: '2:40 PM' },
    { id: '6', sender: 'them', text: 'Perfect! Let\'s schedule for Thursday at 2 PM. I\'ll send a calendar invite.', time: '2:42 PM' }
  ] : []

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      setMessage('')
    }
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] bg-[#0a0a0a]">
        <div className="h-full grid grid-cols-4 gap-6">
          {/* Chats List */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-9 pr-3 py-2 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors"
                />
              </div>
            </div>

            {/* Chats */}
            <div className="flex-1 overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 flex items-start gap-3 border-b border-gray-800 transition-colors ${
                    selectedChat?.id === chat.id
                      ? 'bg-[#6366f1]/10'
                      : 'hover:bg-[#1a1a1a]'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full" />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111111] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5">{chat.company} • {chat.role}</p>
                    <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-[#6366f1] rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {chat.unread}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="col-span-3 bg-[#111111] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={selectedChat.avatar} alt={selectedChat.name} className="w-12 h-12 rounded-full" />
                      {selectedChat.online && (
                        <Circle size={12} className="absolute bottom-0 right-0 fill-green-500 text-green-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{selectedChat.name}</h3>
                      <p className="text-sm text-gray-400">{selectedChat.company} • {selectedChat.role}</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                    <MoreVertical size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            msg.sender === 'me'
                              ? 'bg-[#6366f1] text-white'
                              : 'bg-[#1a1a1a] text-gray-300'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex items-end gap-3">
                    <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors flex-shrink-0">
                      <Paperclip size={20} className="text-gray-400" />
                    </button>
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder="Type a message..."
                        rows={1}
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors resize-none"
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!message.trim()}
                      className="p-3 bg-[#6366f1] hover:bg-[#5558e3] disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors flex-shrink-0"
                    >
                      <Send size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <User size={64} className="text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Chat Selected</h3>
                  <p className="text-gray-400">Choose a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Messages
