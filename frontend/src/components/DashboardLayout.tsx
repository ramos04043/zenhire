import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Briefcase, Search, Settings, 
  LogOut, Bell, Moon, Sun, Sparkles, Zap,
  X, Rocket, ChevronDown, ChevronRight,
  ScanText, PenLine, Mic, Building2, Bookmark
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import { useDataStore } from '../store/dataStore'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const theme = useThemeStore(state => state.theme)
  const toggleTheme = useThemeStore(state => state.toggleTheme)
  const notifications = useDataStore(state => state.notifications)
  const markNotificationRead = useDataStore(state => state.markNotificationRead)
  const markAllNotificationsRead = useDataStore(state => state.markAllNotificationsRead)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleMarkAllRead = async () => {
    if (user?.id) {
      await markAllNotificationsRead(user.id)
    }
  }

  const handleNotificationClick = async (id: string) => {
    await markNotificationRead(id)
  }

  type MenuItem = {
    icon: React.ElementType
    label: string
    path: string
    badge?: string | null
    children?: { icon: React.ElementType; label: string; path: string; badge?: string | null }[]
  }

  const menuItems: MenuItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard',      path: '/dashboard' },
    {
      icon: Sparkles, label: 'Resume AI', path: '/resume-ai',
      children: [
        { icon: ScanText,      label: 'Resume Review',  path: '/resume-analyzer' },
        { icon: Zap,           label: 'Optimizer',      path: '/optimize',               badge: 'New' },
        { icon: PenLine,       label: 'Cover Letter',   path: '/cover-letter-generator' },
        { icon: Mic,           label: 'Interview Prep', path: '/interview-preparation' },
      ]
    },
    { icon: Briefcase, label: 'Applications', path: '/applications' },
    {
      icon: Search, label: 'Jobs', path: '/jobs-group',
      children: [
        { icon: Search,   label: 'All Jobs',      path: '/jobs' },
        { icon: Rocket,   label: 'Startup Jobs',  path: '/startup-jobs', badge: 'New' },
        { icon: Bookmark, label: 'Saved Jobs',    path: '/saved-jobs' },
      ]
    },
    { icon: Building2, label: 'Dream Companies', path: '/dream-companies' },
    { icon: Settings,  label: 'Settings',        path: '/settings' },
  ]

  // Paths that belong to Resume AI group
  const resumeAIPaths = ['/resume-analyzer', '/optimize', '/cover-letter-generator', '/interview-preparation', '/resume', '/resume-versions', '/ai-resume-builder']
  const jobsPaths = ['/jobs', '/startup-jobs', '/saved-jobs']

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => ({
    '/resume-ai':   resumeAIPaths.includes(location.pathname),
    '/jobs-group':  jobsPaths.includes(location.pathname),
  }))

  const toggleGroup = (path: string) => {
    setOpenGroups(prev => ({ ...prev, [path]: !prev[path] }))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-dark-border/50 p-6 z-50">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 mb-10 group">
          <div className="w-10 h-10 bg-dark-accent rounded flex items-center justify-center transition-transform group-hover:scale-105">
            <Zap className="text-white" size={20} strokeWidth={3} />
          </div>
          <div>
            <span className="text-xl font-black text-dark-text-primary block tracking-tighter uppercase">
              ZenHire
            </span>
            <span className="text-[9px] font-bold text-dark-accent uppercase tracking-widest -mt-1 block">Intelligence</span>
          </div>
        </Link>

        <nav className="space-y-1 mb-auto">
          {menuItems.map((item) => {
            const hasChildren = !!item.children
            const isGroupOpen = openGroups[item.path]
            const isChildActive = item.children?.some(c => location.pathname === c.path)
            const isActive = !hasChildren && location.pathname === item.path

            if (hasChildren) {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => toggleGroup(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                      isChildActive
                        ? 'bg-dark-accent/10 text-dark-accent'
                        : 'text-dark-text-secondary hover:bg-dark-bg-secondary hover:text-dark-text-primary'
                    }`}
                  >
                    <item.icon size={18} strokeWidth={1.5} />
                    <span className="text-[11px] font-black uppercase tracking-widest flex-1 text-left">{item.label}</span>
                    {isGroupOpen
                      ? <ChevronDown size={14} className="flex-shrink-0" />
                      : <ChevronRight size={14} className="flex-shrink-0" />
                    }
                  </button>
                  <AnimatePresence initial={false}>
                    {isGroupOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-dark-border/40 pl-3">
                          {item.children!.map((child) => {
                            const isChildItemActive = location.pathname === child.path
                            return (
                              <Link key={child.path} to={child.path}>
                                <div className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                                  isChildItemActive
                                    ? 'bg-dark-accent text-white'
                                    : 'text-dark-text-secondary hover:bg-dark-bg-secondary hover:text-dark-text-primary'
                                }`}>
                                  <child.icon size={15} strokeWidth={isChildItemActive ? 2.5 : 1.5} />
                                  <span className="text-[11px] font-black uppercase tracking-widest flex-1">{child.label}</span>
                                  {child.badge && (
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                                      isChildItemActive
                                        ? 'bg-white/20 text-white'
                                        : 'bg-dark-accent/10 text-dark-accent border border-dark-accent/20'
                                    }`}>
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? 'bg-dark-accent text-white'
                      : 'text-dark-text-secondary hover:bg-dark-bg-secondary hover:text-dark-text-primary'
                  }`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                  <span className={`text-[11px] font-black uppercase tracking-widest flex-1 ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-dark-accent/10 text-dark-accent border border-dark-accent/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 bg-dark-bg-secondary border border-dark-border/50 rounded-lg">
            <div className="relative">
              <div className="w-10 h-10 bg-dark-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-dark-bg-secondary rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-text-primary truncate">
                {user?.full_name || 'User'}
              </p>
              <p className="text-xs text-dark-text-secondary truncate">{user?.email}</p>
            </div>
            <Link to="/settings">
              <button className="p-1.5 hover:bg-dark-bg rounded-lg transition-colors">
                <Settings size={16} className="text-dark-text-secondary" />
              </button>
            </Link>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-bg-secondary hover:bg-red-500/10 border border-dark-border/50 hover:border-red-500/30 text-dark-text-secondary hover:text-red-400 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-dark-bg border-b border-dark-border/50 px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Page Title */}
            <div>
              <h1 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
                {menuItems.find(item => item.path === location.pathname)?.label ||
                  menuItems.flatMap(item => item.children || []).find(c => c.path === location.pathname)?.label ||
                  'Dashboard'}
              </h1>
              <p className="text-xs text-dark-text-secondary mt-0.5">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-dark-card hover:bg-dark-bg-secondary border border-dark-border/50 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="text-dark-text-secondary" size={18} />
                ) : (
                  <Moon className="text-dark-text-secondary" size={18} />
                )}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg bg-dark-card hover:bg-dark-bg-secondary border border-dark-border/50 transition-colors"
                >
                  <Bell className="text-dark-text-secondary" size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      {/* Backdrop */}
                      <div
                        onClick={() => setShowNotifications(false)}
                        className="fixed inset-0 z-40"
                      />
                      
                      {/* Dropdown */}
                      <div className="absolute right-0 mt-2 w-96 bg-dark-card border border-dark-border/50 rounded-lg shadow-xl max-h-[500px] overflow-hidden z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-dark-border/50">
                          <div className="flex items-center gap-2">
                            <Bell size={16} className="text-dark-accent" />
                            <h3 className="font-semibold text-dark-text-primary text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-dark-accent/10 text-dark-accent rounded-full text-xs font-semibold border border-dark-accent/20">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={handleMarkAllRead}
                                className="text-[10px] font-bold text-dark-accent hover:text-dark-accent-hover uppercase tracking-widest"
                              >
                                Mark all read
                              </button>
                            )}
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="p-1 hover:bg-dark-bg-secondary rounded transition-colors"
                            >
                              <X size={16} className="text-dark-text-secondary" />
                            </button>
                          </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                              <Bell size={48} className="text-dark-text-secondary/20 mx-auto mb-3" />
                              <p className="text-sm text-dark-text-secondary">No notifications yet</p>
                              <p className="text-xs text-dark-text-secondary/60 mt-1">
                                We'll notify you when something happens
                              </p>
                            </div>
                          ) : (
                            <div className="divide-y divide-dark-border/50">
                              {notifications.slice(0, 10).map((notification) => (
                                <div
                                  key={notification.id}
                                  onClick={() => handleNotificationClick(notification.id)}
                                  className={`p-4 hover:bg-dark-bg-secondary/50 cursor-pointer transition-colors ${
                                    !notification.is_read ? 'bg-dark-accent/5' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${
                                      notification.type === 'resume_upload' ? 'bg-blue-500/10' :
                                      notification.type === 'status_change' ? 'bg-green-500/10' :
                                      'bg-purple-500/10'
                                    }`}>
                                      <Zap size={14} className={
                                        notification.type === 'resume_upload' ? 'text-blue-400' :
                                        notification.type === 'status_change' ? 'text-green-400' :
                                        'text-purple-400'
                                      } />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-dark-text-primary text-sm">
                                        {notification.title}
                                      </p>
                                      <p className="text-xs text-dark-text-secondary line-clamp-2 mt-1">
                                        {notification.message}
                                      </p>
                                      <p className="text-[10px] text-dark-text-secondary/60 mt-2">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                      </p>
                                    </div>
                                    {!notification.is_read && (
                                      <div className="w-2 h-2 bg-dark-accent rounded-full flex-shrink-0 mt-1" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                          <div className="p-3 border-t border-dark-border/50 bg-dark-bg-secondary/30">
                            <button className="w-full text-center text-sm text-dark-accent hover:text-dark-accent-hover font-medium transition-colors">
                              View all notifications
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 relative">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
