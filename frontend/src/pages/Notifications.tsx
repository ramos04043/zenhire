import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell, Check, Trash2, Filter, CheckCheck, Zap, Briefcase,
  FileText, Star, Users, X, Search
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Notifications = () => {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      type: 'status_change',
      title: 'Application Status Updated',
      message: 'Your application for Senior Developer at TechCorp has moved to Interview stage',
      is_read: false,
      created_at: new Date().toISOString(),
      icon: Briefcase,
      color: 'green'
    },
    {
      id: '2',
      type: 'resume_upload',
      title: 'Resume Analysis Complete',
      message: 'Your resume has been analyzed. ATS Score: 87%',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      icon: FileText,
      color: 'blue'
    },
    {
      id: '3',
      type: 'job_match',
      title: 'New Job Match',
      message: '5 new jobs match your profile with 90%+ compatibility',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      icon: Star,
      color: 'purple'
    },
    {
      id: '4',
      type: 'system',
      title: 'Profile Viewed',
      message: 'Your profile was viewed by 3 recruiters this week',
      is_read: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      icon: Users,
      color: 'yellow'
    }
  ])
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' ||
                         (filter === 'unread' && !notif.is_read) ||
                         (filter === 'read' && notif.is_read) ||
                         notif.type === filter
    return matchesSearch && matchesFilter
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, is_read: true } : n
    ))
    toast.success('Marked as read')
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
    toast.success('All notifications marked as read')
  }

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
    toast.success('Notification deleted')
  }

  const handleClearAll = () => {
    setNotifications([])
    toast.success('All notifications cleared')
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
                <p className="text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 bg-[#111111] hover:bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-lg transition-colors font-medium"
                  >
                    <CheckCheck size={18} />
                    <span>Mark All Read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors font-medium"
                  >
                    <Trash2 size={18} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1] transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filter */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-[#111111] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
              >
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="status_change">Status Updates</option>
                <option value="resume_upload">Resume</option>
                <option value="job_match">Job Matches</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-[#111111] border border-gray-800 rounded-xl"
            >
              <Bell size={64} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm || filter !== 'all' ? 'No notifications found' : 'No notifications'}
              </h3>
              <p className="text-gray-400">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'You\'re all caught up!'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => {
                const Icon = notification.icon
                const colorClasses = {
                  green: 'bg-green-500/10 border-green-500/20 text-green-400',
                  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
                  yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-[#111111] border rounded-xl p-4 transition-all ${
                      notification.is_read
                        ? 'border-gray-800 hover:border-gray-700'
                        : 'border-[#6366f1]/30 hover:border-[#6366f1]/50 bg-[#6366f1]/5'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-2.5 rounded-lg border ${colorClasses[notification.color as keyof typeof colorClasses]}`}>
                        <Icon size={18} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-white">{notification.title}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                            {getTimeAgo(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{notification.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check size={16} className="text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Notifications
