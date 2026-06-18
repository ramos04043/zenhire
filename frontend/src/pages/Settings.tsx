import { Moon, Sun, Download, Trash2 } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useThemeStore } from '../store/themeStore'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'

const Settings = () => {
  const theme = useThemeStore(state => state.theme)
  const toggleTheme = useThemeStore(state => state.toggleTheme)
  const settings = useDataStore(state => state.settings)
  const updateSettings = useDataStore(state => state.updateSettings)
  const { user } = useAuthStore()

  const handleUpdateSettings = async (updates: any) => {
    if (!user) return
    await updateSettings(user.id, updates)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-dark-text-primary mb-6 uppercase tracking-tight">Appearance</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-dark-text-primary text-sm">Theme</h3>
                <p className="text-xs text-dark-text-secondary font-medium">
                  Switch between light and dark visual modes.
                </p>
              </div>
              
              <button
                onClick={toggleTheme}
                className="p-2 bg-dark-bg-secondary hover:bg-dark-border border border-dark-border rounded transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="text-dark-accent" size={20} />
                ) : (
                  <Moon className="text-dark-accent" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-dark-text-primary mb-6 uppercase tracking-tight">Notifications</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-dark-text-primary text-sm">Email Updates</h3>
                <p className="text-xs text-dark-text-secondary font-medium">
                  Receive summaries and application status changes via email.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.email_notifications}
                  onChange={(e) => handleUpdateSettings({ email_notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-dark-bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-dark-accent"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-dark-text-primary text-sm">Desktop Notifications</h3>
                <p className="text-xs text-dark-text-secondary font-medium">
                  Get real-time alerts for new job matches and messages.
                </p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.push_notifications}
                  onChange={(e) => handleUpdateSettings({ push_notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-dark-bg-secondary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-dark-accent"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-xl font-bold text-dark-text-primary mb-6 uppercase tracking-tight">Account Management</h2>
          
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-dark-bg-secondary hover:bg-dark-border border border-dark-border rounded transition-colors">
              <div className="flex items-center gap-3">
                <Download className="text-dark-text-secondary" size={18} />
                <div className="text-left">
                  <h3 className="font-bold text-dark-text-primary text-sm">Export Profile Data</h3>
                  <p className="text-[10px] text-dark-text-secondary font-bold uppercase tracking-widest">JSON format</p>
                </div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between px-4 py-3 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-500" size={18} />
                <div className="text-left">
                  <h3 className="font-bold text-red-500 text-sm">Delete Account</h3>
                  <p className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest">Permanent action</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Settings
