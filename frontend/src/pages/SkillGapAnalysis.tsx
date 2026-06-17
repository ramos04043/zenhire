import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, XCircle, ArrowRight, BookOpen, Award } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

const SkillGapAnalysis = () => {
  const analysis = {
    targetRole: 'Senior Full Stack Developer',
    matchScore: 78,
    yourSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Git', 'REST APIs'],
    missingSkills: ['GraphQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    improvingSkills: ['System Design', 'Microservices', 'Testing']
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Skill Gap Analysis</h1>

          {/* Match Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111] border border-gray-800 rounded-xl p-8 mb-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#6366f1]/10 border-4 border-[#6366f1] mb-4">
                <span className="text-4xl font-black text-[#6366f1]">{analysis.matchScore}%</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Match Score</h2>
              <p className="text-gray-400">for {analysis.targetRole}</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {/* Your Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-400" size={20} />
                Your Skills
              </h3>
              <div className="space-y-2">
                {analysis.yourSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111111] border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <XCircle className="text-red-400" size={20} />
                Skills to Learn
              </h3>
              <div className="space-y-2">
                {analysis.missingSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle size={16} className="text-red-400" />
                      <span className="text-gray-300">{skill}</span>
                    </div>
                    <Link to={`/learning?skill=${skill}`} className="text-[#6366f1] hover:text-[#5558e3] text-sm font-medium">
                      Learn
                    </Link>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Ready to Close the Gap?</h3>
                <p className="text-gray-400">Explore personalized learning paths to boost your skills</p>
              </div>
              <Link
                to="/career-roadmap"
                className="flex items-center gap-2 px-6 py-3 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg transition-colors font-medium"
              >
                View Roadmap
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SkillGapAnalysis
