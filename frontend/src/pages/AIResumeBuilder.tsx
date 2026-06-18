import DashboardLayout from '../components/DashboardLayout'
import { Sparkles, Download, Eye } from 'lucide-react'

const AIResumeBuilder = () => {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="text-[#6366f1]" />
              AI Resume Builder
            </h1>
            <p className="text-gray-400">Create professional resumes with AI assistance</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Resume Content</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Professional Summary</label>
                    <textarea
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white focus:border-[#6366f1] focus:outline-none"
                      rows={4}
                      placeholder="AI will help generate a compelling summary..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Experience</label>
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 min-h-[200px]">
                      <p className="text-gray-500 text-sm">Add your work experience...</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js'].map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-[#6366f1]/10 text-[#6366f1] rounded-full text-sm border border-[#6366f1]/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#111111] border border-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">AI Assistant</h2>
                <p className="text-gray-400 text-sm mb-4">Let AI help you create a professional resume</p>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors">
                    <Sparkles size={18} />
                    <span>Generate Summary</span>
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                    <Eye size={18} />
                    <span>Preview</span>
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-gray-800 text-white rounded-lg transition-colors">
                    <Download size={18} />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-6">
                <h3 className="text-white font-bold mb-3">✨ Pro Tips</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Use action verbs</li>
                  <li>• Quantify achievements</li>
                  <li>• Tailor to job description</li>
                  <li>• Keep it concise</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AIResumeBuilder
