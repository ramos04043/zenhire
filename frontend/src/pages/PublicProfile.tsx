import DashboardLayout from '../components/DashboardLayout'
import { MapPin, Mail, Globe, Linkedin, Github, Briefcase, GraduationCap, Award } from 'lucide-react'

const PublicProfile = () => {
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
                    JD
                  </div>
                  <div className="mb-2">
                    <h1 className="text-3xl font-bold text-white mb-1">John Doe</h1>
                    <p className="text-xl text-gray-400">Senior Frontend Developer</p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium mb-2">
                  Edit Profile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">About</h2>
                    <p className="text-gray-400 leading-relaxed">
                      Passionate frontend developer with 5+ years of experience building scalable web applications. 
                      Specialized in React, TypeScript, and modern web technologies.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Mail size={16} />
                        <span>john.doe@email.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={16} />
                        <span>San Francisco, CA</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Globe size={16} />
                        <span>johndoe.com</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS'].map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-full text-sm border border-[#6366f1]/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Experience</h2>
                    <div className="space-y-4">
                      {[
                        { company: 'Tech Corp', role: 'Senior Developer', period: '2022 - Present' },
                        { company: 'Startup Inc', role: 'Frontend Developer', period: '2020 - 2022' },
                      ].map((exp, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-10 h-10 bg-[#6366f1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Briefcase className="text-[#6366f1]" size={18} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{exp.role}</p>
                            <p className="text-gray-400 text-sm">{exp.company}</p>
                            <p className="text-gray-500 text-xs">{exp.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white mb-3">Education</h2>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-[#6366f1]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="text-[#6366f1]" size={18} />
                      </div>
                      <div>
                        <p className="text-white font-medium">Computer Science, BS</p>
                        <p className="text-gray-400 text-sm">Stanford University</p>
                        <p className="text-gray-500 text-xs">2016 - 2020</p>
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

export default PublicProfile
