import DashboardLayout from '../components/DashboardLayout'
import { FileText, Download, Eye, Star, Plus } from 'lucide-react'

const ResumeVersions = () => {
  const versions = [
    {
      id: 1,
      name: 'Frontend Specialist',
      lastModified: '2 hours ago',
      score: 92,
      applications: 15,
      starred: true,
    },
    {
      id: 2,
      name: 'Full Stack General',
      lastModified: '1 day ago',
      score: 88,
      applications: 23,
      starred: false,
    },
    {
      id: 3,
      name: 'Senior Engineer',
      lastModified: '3 days ago',
      score: 85,
      applications: 8,
      starred: false,
    },
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Resume Versions</h1>
              <p className="text-gray-400">Manage multiple resume versions for different roles</p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
              <Plus size={20} />
              <span>Create Version</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {versions.map(version => (
              <div key={version.id} className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#6366f1]/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-[#6366f1]" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{version.name}</h3>
                      <p className="text-sm text-gray-500">{version.lastModified}</p>
                    </div>
                  </div>
                  <button>
                    <Star className={version.starred ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">ATS Score</p>
                    <p className="text-2xl font-bold text-white">{version.score}</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-sm text-gray-400 mb-1">Applications</p>
                    <p className="text-2xl font-bold text-white">{version.applications}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                    <Eye size={16} />
                    <span className="text-sm">View</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResumeVersions
