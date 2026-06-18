import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Mail, Phone, Linkedin, Github, Globe,
  Briefcase, GraduationCap, Award, FileText, Star, Edit,
  Camera, ExternalLink, TrendingUp
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuthStore } from '../store/authStore'
import { useDataStore } from '../store/dataStore'

const Profile = () => {
  const { user } = useAuthStore()
  const { applications } = useDataStore()
  const [activeTab, setActiveTab] = useState('overview')

  const profileData = {
    name: user?.full_name || 'John Doe',
    email: user?.email || 'john@example.com',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    website: 'https://johndoe.com',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=6366f1&color=fff&size=200`,
    stats: {
      profileViews: 142,
      applications: applications.length,
      savedJobs: 12,
      atsScore: 87
    },
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Python', 'GraphQL'],
    experience: [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        period: '2020 - Present',
        description: 'Leading development of cloud-based applications'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupX',
        period: '2018 - 2020',
        description: 'Built scalable web applications from scratch'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'Stanford University',
        year: '2018'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional',
      'MongoDB Certified Developer'
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden mb-6"
          >
            {/* Cover Image */}
            <div className="h-32 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] relative">
              <button className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-lg transition-colors">
                <Camera size={18} className="text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex items-start gap-6 -mt-16 mb-6">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-32 h-32 rounded-xl border-4 border-[#111111] bg-[#111111]"
                  />
                  <button className="absolute bottom-2 right-2 p-2 bg-[#6366f1] hover:bg-[#5558e3] rounded-lg transition-colors">
                    <Camera size={14} className="text-white" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex-1 mt-16">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">{profileData.name}</h1>
                      <p className="text-gray-400 mb-2">{profileData.title}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{profileData.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={14} />
                          <span>{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} />
                          <span>{profileData.phone}</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-gray-300 rounded-lg transition-colors font-medium"
                    >
                      <Edit size={16} />
                      <span>Edit Profile</span>
                    </Link>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-400 mb-4">{profileData.bio}</p>

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    {profileData.linkedin && (
                      <a
                        href={profileData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg text-sm text-gray-300 transition-colors"
                      >
                        <Linkedin size={14} />
                        <span>LinkedIn</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {profileData.github && (
                      <a
                        href={profileData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg text-sm text-gray-300 transition-colors"
                      >
                        <Github size={14} />
                        <span>GitHub</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {profileData.website && (
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg text-sm text-gray-300 transition-colors"
                      >
                        <Globe size={14} />
                        <span>Website</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{profileData.stats.profileViews}</div>
                  <div className="text-xs text-gray-400">Profile Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{profileData.stats.applications}</div>
                  <div className="text-xs text-gray-400">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{profileData.stats.savedJobs}</div>
                  <div className="text-xs text-gray-400">Saved Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#6366f1] mb-1">{profileData.stats.atsScore}%</div>
                  <div className="text-xs text-gray-400">ATS Score</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-gray-800">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#6366f1]'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6366f1]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Experience */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111111] border border-gray-800 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase size={20} className="text-[#6366f1]" />
                        Work Experience
                      </h2>
                      <button className="text-sm text-[#6366f1] hover:text-[#5558e3] font-medium">
                        Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {profileData.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-[#6366f1] pl-4">
                          <h3 className="font-bold text-white mb-1">{exp.title}</h3>
                          <p className="text-sm text-gray-400 mb-1">{exp.company}</p>
                          <p className="text-xs text-gray-500 mb-2">{exp.period}</p>
                          <p className="text-sm text-gray-400">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Education */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#111111] border border-gray-800 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <GraduationCap size={20} className="text-[#6366f1]" />
                        Education
                      </h2>
                      <button className="text-sm text-[#6366f1] hover:text-[#5558e3] font-medium">
                        Add
                      </button>
                    </div>
                    <div className="space-y-4">
                      {profileData.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-[#6366f1] pl-4">
                          <h3 className="font-bold text-white mb-1">{edu.degree}</h3>
                          <p className="text-sm text-gray-400 mb-1">{edu.school}</p>
                          <p className="text-xs text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}

              {activeTab === 'skills' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#111111] border border-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Skills</h2>
                    <button className="text-sm text-[#6366f1] hover:text-[#5558e3] font-medium">
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg text-sm font-medium text-[#6366f1]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Certifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Award size={16} className="text-[#6366f1]" />
                  Certifications
                </h3>
                <div className="space-y-3">
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star size={14} className="text-[#6366f1] mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-400">{cert}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to="/resume"
                    className="flex items-center gap-2 p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors text-sm text-gray-300"
                  >
                    <FileText size={16} />
                    <span>View Resumes</span>
                  </Link>
                  <Link
                    to="/applications"
                    className="flex items-center gap-2 p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors text-sm text-gray-300"
                  >
                    <Briefcase size={16} />
                    <span>My Applications</span>
                  </Link>
                  <Link
                    to="/career-insights"
                    className="flex items-center gap-2 p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors text-sm text-gray-300"
                  >
                    <TrendingUp size={16} />
                    <span>Career Insights</span>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile
