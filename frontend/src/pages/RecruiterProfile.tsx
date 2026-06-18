import DashboardLayout from '../components/DashboardLayout'
import { Mail, Linkedin, Building, MapPin, Phone } from 'lucide-react'

const RecruiterProfile = () => {
  const recruiter = {
    name: 'Sarah Johnson',
    company: 'Google',
    position: 'Senior Technical Recruiter',
    location: 'Mountain View, CA',
    email: 'sarah.j@google.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/sarahjohnson',
    bio: 'Senior Technical Recruiter at Google with 8+ years of experience. Specializing in frontend and full-stack engineering roles.',
    openPositions: 12,
    activeHires: 45,
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#111111] border border-gray-800 rounded-lg overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#6366f1] to-purple-500"></div>
            
            <div className="px-8 pb-8">
              <div className="flex items-end justify-between -mt-16 mb-6">
                <div className="flex items-end gap-6">
                  <div className="w-32 h-32 bg-[#111111] border-4 border-[#111111] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                    SJ
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-white mb-1">{recruiter.name}</h1>
                    <p className="text-xl text-gray-400">{recruiter.position}</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium mb-2">
                  Send Message
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">About</h2>
                    <p className="text-gray-400 leading-relaxed">{recruiter.bio}</p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={16} />
                        <span>{recruiter.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone size={16} />
                        <span>{recruiter.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Linkedin size={16} />
                        <span>{recruiter.linkedin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={16} />
                        <span>{recruiter.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Company</h2>
                    <div className="flex items-center gap-3 bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                      <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                        <Building className="text-[#6366f1]" size={24} />
                      </div>
                      <div>
                        <p className="text-white font-bold">{recruiter.company}</p>
                        <p className="text-sm text-gray-400">Technology Company</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Stats</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Open Positions</p>
                        <p className="text-2xl font-bold text-white">{recruiter.openPositions}</p>
                      </div>
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">Active Hires</p>
                        <p className="text-2xl font-bold text-white">{recruiter.activeHires}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default RecruiterProfile
