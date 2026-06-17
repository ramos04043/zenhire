import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bookmark, MapPin, DollarSign, Building2, Trash2, Send,
  TrendingUp, Filter, Search, X
} from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const SavedJobs = () => {
  const { user } = useAuthStore()
  const [savedJobs, setSavedJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock saved jobs data
    const mockSavedJobs = [
      {
        id: '1',
        job_id: 'job1',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120k - $180k',
        type: 'Full-time',
        remote: 'Hybrid',
        logo: 'https://ui-avatars.com/api/?name=TechCorp&background=6366f1&color=fff',
        match_score: 87,
        saved_date: '2024-01-15',
        is_applied: false
      },
      {
        id: '2',
        job_id: 'job2',
        title: 'Product Manager',
        company: 'StartupX',
        location: 'Remote',
        salary: '$140k - $200k',
        type: 'Full-time',
        remote: 'Remote',
        logo: 'https://ui-avatars.com/api/?name=StartupX&background=10b981&color=fff',
        match_score: 92,
        saved_date: '2024-01-14',
        is_applied: true
      },
      {
        id: '3',
        job_id: 'job3',
        title: 'UX Designer',
        company: 'DesignHub',
        location: 'New York, NY',
        salary: '$100k - $150k',
        type: 'Full-time',
        remote: 'Hybrid',
        logo: 'https://ui-avatars.com/api/?name=DesignHub&background=f59e0b&color=fff',
        match_score: 78,
        saved_date: '2024-01-13',
        is_applied: false
      },
      {
        id: '4',
        job_id: 'job4',
        title: 'Data Scientist',
        company: 'DataCorp',
        location: 'Boston, MA',
        salary: '$130k - $190k',
        type: 'Full-time',
        remote: 'Remote',
        logo: 'https://ui-avatars.com/api/?name=DataCorp&background=8b5cf6&color=fff',
        match_score: 85,
        saved_date: '2024-01-12',
        is_applied: false
      }
    ]

    setSavedJobs(mockSavedJobs)
    setFilteredJobs(mockSavedJobs)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = savedJobs

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      if (filterType === 'applied') {
        filtered = filtered.filter(job => job.is_applied)
      } else if (filterType === 'not-applied') {
        filtered = filtered.filter(job => !job.is_applied)
      } else if (filterType === 'remote') {
        filtered = filtered.filter(job => job.remote === 'Remote')
      }
    }

    setFilteredJobs(filtered)
  }, [searchTerm, filterType, savedJobs])

  const handleUnsave = (id: string) => {
    setSavedJobs(savedJobs.filter(job => job.id !== id))
    toast.success('Job removed from saved')
  }

  const handleApply = (jobId: string) => {
    toast.success('Redirecting to application...')
    // Navigate to application flow
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Saved Jobs</h1>
                <p className="text-gray-400">Jobs you've bookmarked for later</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-[#111111] border border-gray-800 rounded-lg text-sm font-medium text-gray-300">
                  {savedJobs.length} saved
                </span>
                <Link
                  to="/jobs"
                  className="px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
                >
                  Find More Jobs
                </Link>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search saved jobs..."
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

              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 bg-[#111111] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer"
                >
                  <option value="all">All Jobs</option>
                  <option value="applied">Applied</option>
                  <option value="not-applied">Not Applied</option>
                  <option value="remote">Remote Only</option>
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Bookmark size={64} className="text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {searchTerm || filterType !== 'all' ? 'No jobs found' : 'No saved jobs yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start saving jobs to keep track of opportunities'}
              </p>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
              >
                <Search size={18} />
                <span>Browse Jobs</span>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    {/* Company Logo */}
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-16 h-16 rounded-xl border border-gray-800"
                    />

                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            to={`/jobs/${job.job_id}`}
                            className="text-lg font-bold text-white hover:text-[#6366f1] transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                            <div className="flex items-center gap-1.5">
                              <Building2 size={14} />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <DollarSign size={14} />
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-lg">
                          <TrendingUp size={14} className="text-[#6366f1]" />
                          <span className="text-sm font-bold text-[#6366f1]">{job.match_score}% Match</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-[#1a1a1a] border border-gray-800 rounded-full text-xs font-medium text-gray-300">
                          {job.type}
                        </span>
                        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-medium text-blue-400">
                          {job.remote}
                        </span>
                        {job.is_applied && (
                          <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium text-green-400">
                            Applied
                          </span>
                        )}
                        <span className="text-xs text-gray-500 ml-auto">
                          Saved {new Date(job.saved_date).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/jobs/${job.job_id}`}
                          className="flex-1 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-gray-300 rounded-lg transition-colors text-center font-medium text-sm"
                        >
                          View Details
                        </Link>
                        {!job.is_applied && (
                          <button
                            onClick={() => handleApply(job.job_id)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium text-sm"
                          >
                            <Send size={16} />
                            <span>Apply Now</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleUnsave(job.id)}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors font-medium text-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SavedJobs
