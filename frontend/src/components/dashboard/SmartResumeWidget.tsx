import { motion } from 'framer-motion'
import { FileText, Sparkles, Download, Eye, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SmartResumeWidgetProps {
  atsScore: number
  keywordMatch: number
  missingSkills: string[]
  hasResume: boolean
}

const SmartResumeWidget = ({ 
  atsScore, 
  keywordMatch, 
  missingSkills,
  hasResume 
}: SmartResumeWidgetProps) => {
  const scoreColor = atsScore >= 80 ? 'green' : atsScore >= 60 ? 'yellow' : 'red'
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (atsScore / 100) * circumference

  if (!hasResume) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={32} className="text-dark-text-secondary" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Resume Yet</h3>
        <p className="text-sm text-dark-text-secondary mb-6">
          Upload your resume to get AI-powered insights and optimization
        </p>
        <Link
          to="/resume"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold transition-all"
        >
          <Sparkles size={18} />
          Upload Resume
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-card/50 backdrop-blur-xl border border-dark-border rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-dark-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Resume Health</h3>
              <p className="text-xs text-dark-text-secondary">AI Analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-dark-bg rounded-xl transition-colors">
              <Eye size={18} className="text-dark-text-secondary hover:text-white" />
            </button>
            <button className="p-2 hover:bg-dark-bg rounded-xl transition-colors">
              <Download size={18} className="text-dark-text-secondary hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* ATS Score Ring */}
      <div className="p-6 flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-dark-bg"
            />
            <circle
              cx="96"
              cy="96"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`text-${scoreColor}-500 transition-all duration-1000`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-5xl font-bold text-white">{atsScore}</span>
            <span className="text-sm text-dark-text-secondary">ATS Score</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-6 border-t border-dark-border/50">
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-1">{keywordMatch}%</p>
          <p className="text-xs text-dark-text-secondary">Keyword Match</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white mb-1">{missingSkills.length}</p>
          <p className="text-xs text-dark-text-secondary">Missing Skills</p>
        </div>
      </div>

      {/* Improvements */}
      <div className="p-6 bg-dark-bg/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">Suggested Improvements</h4>
          <Sparkles size={16} className="text-dark-accent" />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-dark-text-secondary">Strong action verbs</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-dark-text-secondary">Quantified achievements</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <span className="text-dark-text-secondary">Add {missingSkills[0] || 'Python'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <AlertCircle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <span className="text-dark-text-secondary">Optimize length</span>
          </div>
        </div>

        <Link
          to="/resume"
          className="block w-full text-center py-3 bg-dark-accent hover:bg-dark-accent-hover text-white rounded-2xl font-semibold transition-all mt-4"
        >
          AI Rewrite Resume
        </Link>
      </div>
    </motion.div>
  )
}

export default SmartResumeWidget
