import DashboardLayout from '../components/DashboardLayout'
import { Shield, Lock, Eye, EyeOff, Key, Smartphone } from 'lucide-react'

const PrivacySecurity = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Privacy & Security</h1>
            <p className="text-gray-400">Manage your privacy and security settings</p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-[#6366f1]" size={24} />
                <h2 className="text-xl font-bold text-white">Security</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <Lock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Password</p>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <Smartphone className="text-gray-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Key className="text-gray-400" size={20} />
                    <div>
                      <p className="text-white font-medium">Active Sessions</p>
                      <p className="text-sm text-gray-500">Manage devices where you're logged in</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="text-[#6366f1]" size={24} />
                <h2 className="text-xl font-bold text-white">Privacy</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">Profile Visibility</p>
                    <p className="text-sm text-gray-500">Control who can see your profile</p>
                  </div>
                  <select className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg focus:border-[#6366f1] focus:outline-none">
                    <option>Public</option>
                    <option>Recruiters Only</option>
                    <option>Private</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-800">
                  <div>
                    <p className="text-white font-medium">Resume Visibility</p>
                    <p className="text-sm text-gray-500">Control who can see your resume</p>
                  </div>
                  <select className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg focus:border-[#6366f1] focus:outline-none">
                    <option>Visible to All</option>
                    <option>Visible to Recruiters</option>
                    <option>Hidden</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-white font-medium">Activity Status</p>
                    <p className="text-sm text-gray-500">Show when you're active</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all data</p>
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default PrivacySecurity
