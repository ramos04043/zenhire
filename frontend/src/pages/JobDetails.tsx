import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, MapPin, DollarSign, Clock, Building2,
  Bookmark, Send, Share2, ExternalLink, CheckCircle, AlertCircle,
  TrendingUp, Users, Calendar, Zap
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useDataStore } from '../store/dataStore'
import toast from 'react-hot-toast'

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [similarJobs, setSimilarJobs] = useState<any[]>([])
  const applications = useDataStore(state => state.applications)
  const savedJobs = useDataStore(state => state.savedJobs)

  useEffect(() => {
    // Mock job data - replace with actual API call
    const mockJob = {
      id: id || '1',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      type: 'Full-time',
      remote: 'Hybrid',
      posted: '2 days ago',
      applicants: 45,
      logo: 'https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff',
      description: `We're looking for a talented Full Stack Developer to join our growing team. You'll work on cutting-edge web applications using React, Node.js, and cloud technologies.`,
      responsibilities: [
        'Develop and maintain web applications using React and Node.js',
        'Collaborate with cross-functional teams to define and ship new features',
        'Write clean, maintainable, and well-tested code',
        'Participate in code reviews and contribute to team knowledge sharing',
        'Stay up-to-date with emerging technologies and industry trends'
      ],
      requirements: [
        '5+ years of experience in full-stack development',
        'Strong proficiency in React, TypeScript, and Node.js',
        'Experience with PostgreSQL or similar databases',
        'Familiarity with AWS or other cloud platforms',
        'Excellent problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Health, dental, and vision insurance',
        'Flexible work hours and remote options',
        '401(k) matching',
        'Professional development budget',
        'Unlimited PTO'
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker', 'Git'],
      matchScore: 87
    }

    setJob(mockJob)
    setIsSaved(savedJobs.some(j => j === id))
    
    // Mock similar jobs
    setSimilarJobs([
      { id: '2', title: 'Frontend Developer', company: 'StartupX', match: 82 },
      { id: '3', title: 'Backend Engineer', company: 'CloudCo', match: 78 },
      { id: '4', title: 'Full Stack Engineer', company: 'DevShop', match: 85 }
    ])
    
    setLoading(false)
  }, [id, savedJobs])

  const handleSave = () => {
    setIsSaved(!isSaved)
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully!')
  }

  const handleApply = () => {
    navigate(`/applications?apply=${id}`)
    toast.success('Application started!')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Job link copied to clipboard!')
  }

  const isApplied = applications.some(app => app.position === job?.title)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1]"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Job Not Found</h2>
            <button
              onClick={() => navigate('/jobs')}
              className="mt-4 px-4 py-2 bg-[#6366f1] text-white rounded-lg hover:bg-[#5558e3] transition-colors"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Content - 2 columns */}
            <div className="col-span-2 space-y-6">
              {/* Header Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-20 h-20 rounded-xl border border-gray-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <Building2 size={16} />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={16} />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleShare}
                          className="p-2.5 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors"
                        >
                          <Share2 size={18} className="text-gray-400" />
                        </button>
                        <button
                          onClick={handleSave}
                          className={`p-2.5 border rounded-lg transition-colors ${
                            isSaved
                              ? 'bg-[#6366f1] border-[#6366f1] text-white'
                              : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:bg-[#222222]'
                          }`}
                        >
                          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-[#1a1a1a] border border-gray-800 rounded-full text-xs font-medium text-gray-300">
                        {job.type}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400">
                        {job.remote}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium text-green-400">
                        <DollarSign size={14} />
                        {job.salary}
                      </span>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-2 p-3 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg">
                      <TrendingUp size={18} className="text-[#6366f1]" />
                      <span className="text-sm text-gray-300">
                        <span className="font-bold text-[#6366f1]">{job.matchScore}% Match</span> based on your profile
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-800">
                  {isApplied ? (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg cursor-not-allowed"
                    >
                      <CheckCircle size={18} />
                      <span className="font-medium">Already Applied</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleApply}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
                    >
                      <Send size={18} />
                      <span>Apply Now</span>
                    </button>
                  )}
                  <Link
                    to={`/companies/${job.company}`}
                    className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-gray-300 rounded-lg transition-colors font-medium"
                  >
                    View Company
                  </Link>
                  <button
                    onClick={() => navigate(`/cover-letter?job=${id}`)}
                    className="px-6 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-gray-300 rounded-lg transition-colors font-medium"
                  >
                    Generate Cover Letter
                  </button>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">About the Role</h2>
                <p className="text-gray-400 leading-relaxed">{job.description}</p>
              </motion.div>

              {/* Responsibilities */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-400">
                      <Zap size={16} className="text-[#6366f1] mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Requirements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-gray-400">
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">Benefits & Perks</h2>
                <div className="grid grid-cols-2 gap-3">
                  {job.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                      <CheckCircle size={16} className="text-[#6366f1]" />
                      <span className="text-sm text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Job Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Applicants</span>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-[#6366f1]" />
                      <span className="font-medium text-white">{job.applicants}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Posted</span>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#6366f1]" />
                      <span className="font-medium text-white">{job.posted}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Employment Type</span>
                    <span className="font-medium text-white">{job.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Work Mode</span>
                    <span className="font-medium text-white">{job.remote}</span>
                  </div>
                </div>
              </motion.div>

              {/* Required Skills */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg text-sm font-medium text-[#6366f1]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/skill-gap-analysis?job=${id}`}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <TrendingUp size={16} />
                  <span>Analyze Skill Gap</span>
                </Link>
              </motion.div>

              {/* Similar Jobs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Similar Jobs</h3>
                <div className="space-y-3">
                  {similarJobs.map((similar) => (
                    <Link
                      key={similar.id}
                      to={`/jobs/${similar.id}`}
                      className="block p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors"
                    >
                      <h4 className="text-sm font-medium text-white mb-1">{similar.title}</h4>
                      <p className="text-xs text-gray-400 mb-2">{similar.company}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#111111] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#6366f1] h-full rounded-full"
                            style={{ width: `${similar.match}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#6366f1]">{similar.match}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Company Link */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company</h3>
                <Link
                  to={`/companies/${job.company}`}
                  className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors"
                >
                  <img src={job.logo} alt={job.company} className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">{job.company}</h4>
                    <p className="text-xs text-gray-400">View all jobs</p>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobDetails
