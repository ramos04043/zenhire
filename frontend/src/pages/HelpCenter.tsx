import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Search, HelpCircle, Book, MessageSquare, FileText, Video, ChevronDown, ChevronRight } from 'lucide-react'

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Book,
      articles: [
        { title: 'How to create an account', views: 1234 },
        { title: 'Setting up your profile', views: 987 },
        { title: 'Uploading your first resume', views: 856 },
        { title: 'Understanding your dashboard', views: 745 }
      ]
    },
    {
      id: 'resume',
      title: 'Resume & Optimization',
      icon: FileText,
      articles: [
        { title: 'How ATS scoring works', views: 2341 },
        { title: 'Optimizing your resume', views: 1876 },
        { title: 'Using AI resume builder', views: 1654 },
        { title: 'Resume best practices', views: 1432 }
      ]
    },
    {
      id: 'applications',
      title: 'Job Applications',
      icon: MessageSquare,
      articles: [
        { title: 'Tracking your applications', views: 1543 },
        { title: 'Application status meanings', views: 1234 },
        { title: 'Following up with employers', views: 987 },
        { title: 'Managing multiple applications', views: 765 }
      ]
    },
    {
      id: 'account',
      title: 'Account & Settings',
      icon: HelpCircle,
      articles: [
        { title: 'Changing your password', views: 890 },
        { title: 'Privacy settings', views: 756 },
        { title: 'Notification preferences', views: 654 },
        { title: 'Deleting your account', views: 432 }
      ]
    }
  ]

  const popularArticles = [
    { title: 'How to improve your ATS score', category: 'Resume', views: 3456 },
    { title: 'Best time to apply for jobs', category: 'Tips', views: 2987 },
    { title: 'Writing effective cover letters', category: 'Applications', views: 2543 },
    { title: 'Interview preparation guide', category: 'Career', views: 2234 }
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6366f1] rounded flex items-center justify-center">
                <Zap className="text-white" size={20} strokeWidth={3} />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">ZenHire</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link to="/login" className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-12 bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl font-black text-white mb-6">How can we help you?</h1>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#111111] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Categories */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
            {categories.map((category, index) => {
              const Icon = category.icon
              const isExpanded = expandedCategory === category.id

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-[#1a1a1a] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg flex items-center justify-center">
                        <Icon size={24} className="text-[#6366f1]" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-white">{category.title}</h3>
                        <p className="text-sm text-gray-400">{category.articles.length} articles</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-800 px-6 py-4 space-y-2">
                      {category.articles.map((article, idx) => (
                        <Link
                          key={idx}
                          to="#"
                          className="block p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">{article.title}</span>
                            <span className="text-xs text-gray-500">{article.views} views</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Articles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-6"
            >
              <h3 className="font-bold text-white mb-4">Popular Articles</h3>
              <div className="space-y-3">
                {popularArticles.map((article, idx) => (
                  <Link
                    key={idx}
                    to="#"
                    className="block p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors"
                  >
                    <h4 className="text-sm font-medium text-white mb-1">{article.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.category}</span>
                      <span>{article.views} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-6"
            >
              <MessageSquare size={32} className="text-[#6366f1] mb-3" />
              <h3 className="font-bold text-white mb-2">Still need help?</h3>
              <p className="text-sm text-gray-400 mb-4">Our support team is here to assist you.</p>
              <Link
                to="/contact"
                className="block text-center px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
              >
                Contact Support
              </Link>
            </motion.div>

            {/* Video Tutorials */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-6"
            >
              <Video size={32} className="text-purple-400 mb-3" />
              <h3 className="font-bold text-white mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-400 mb-4">Watch step-by-step guides</p>
              <Link
                to="#"
                className="block text-center px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-gray-300 rounded-lg transition-colors font-medium"
              >
                Browse Videos
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpCenter
