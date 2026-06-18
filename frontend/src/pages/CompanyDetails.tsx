import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Building2, MapPin, Users, Globe, Linkedin, Twitter,
  Star, DollarSign, Award, Heart
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import toast from 'react-hot-toast'

const CompanyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    // Mock company data
    const mockCompany = {
      id: id || '1',
      name: 'TechCorp Inc.',
      logo: 'https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff&size=200',
      tagline: 'Building the Future of Technology',
      description: 'TechCorp is a leading technology company focused on creating innovative solutions that transform how people work and live. With over 10,000 employees worldwide, we\'re committed to pushing the boundaries of what\'s possible.',
      industry: 'Technology',
      size: '1000-5000 employees',
      founded: '2010',
      location: 'San Francisco, CA',
      website: 'https://techcorp.com',
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      rating: 4.5,
      reviews: 1234,
      culture: [
        'Innovation-driven',
        'Work-life balance',
        'Remote-friendly',
        'Learning culture',
        'Diverse & inclusive'
      ],
      benefits: [
        'Health insurance',
        '401(k) matching',
        'Unlimited PTO',
        'Stock options',
        'Learning budget',
        'Remote work'
      ],
      stats: {
        openJobs: 24,
        employees: 3500,
        avgSalary: '$135k',
        funding: '$250M'
      }
    }

    setCompany(mockCompany)
    
    // Mock jobs
    setJobs([
      { id: '1', title: 'Senior Full Stack Developer', location: 'Remote', salary: '$120k - $180k', type: 'Full-time', posted: '2 days ago' },
      { id: '2', title: 'Product Manager', location: 'San Francisco, CA', salary: '$140k - $200k', type: 'Full-time', posted: '1 week ago' },
      { id: '3', title: 'UX Designer', location: 'Hybrid', salary: '$100k - $150k', type: 'Full-time', posted: '3 days ago' },
      { id: '4', title: 'Data Scientist', location: 'Remote', salary: '$130k - $190k', type: 'Full-time', posted: '5 days ago' }
    ])
    
    setLoading(false)
  }, [id])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? 'Unfollowed company' : 'Following company!')
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1]"></div>
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

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-8 mb-6"
          >
            <div className="flex items-start gap-6">
              <img
                src={company.logo}
                alt={company.name}
                className="w-24 h-24 rounded-xl border border-gray-800"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
                    <p className="text-gray-400 mb-3">{company.tagline}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={16} />
                        <span>{company.industry}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={16} />
                        <span>{company.size}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleFollow}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? 'bg-[#1a1a1a] border border-gray-800 text-gray-300 hover:bg-[#222222]'
                        : 'bg-[#6366f1] hover:bg-[#5558e3] text-white'
                    }`}
                  >
                    <Heart size={18} fill={isFollowing ? 'currentColor' : 'none'} />
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-400" fill="currentColor" />
                    <span className="font-bold text-white">{company.rating}</span>
                    <span className="text-sm text-gray-400">({company.reviews} reviews)</span>
                  </div>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#6366f1] hover:text-[#5558e3] transition-colors"
                  >
                    <Globe size={16} />
                    <span>Visit Website</span>
                  </a>
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#6366f1] hover:text-[#5558e3] transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={company.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[#6366f1] hover:text-[#5558e3] transition-colors"
                  >
                    <Twitter size={16} />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h2 className="text-lg font-bold text-white mb-4">About {company.name}</h2>
                <p className="text-gray-400 leading-relaxed">{company.description}</p>
              </motion.div>

              {/* Open Positions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Open Positions ({jobs.length})</h2>
                  <Link
                    to={`/jobs?company=${company.name}`}
                    className="text-sm text-[#6366f1] hover:text-[#5558e3] font-medium transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="block p-4 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 rounded-lg transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-white">{job.title}</h3>
                        <span className="text-xs text-gray-400">{job.posted}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign size={14} />
                          <span>{job.salary}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
                          {job.type}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Company Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Open Jobs</span>
                    <span className="font-bold text-white text-lg">{company.stats.openJobs}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Employees</span>
                    <span className="font-bold text-white text-lg">{company.stats.employees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Avg Salary</span>
                    <span className="font-bold text-white text-lg">{company.stats.avgSalary}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Funding</span>
                    <span className="font-bold text-white text-lg">{company.stats.funding}</span>
                  </div>
                </div>
              </motion.div>

              {/* Culture */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Culture & Values</h3>
                <div className="space-y-2">
                  {company.culture.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                      <Award size={14} className="text-[#6366f1]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {company.benefits.map((benefit: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-[#1a1a1a] border border-gray-800 rounded-lg text-xs text-gray-300"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CompanyDetails
