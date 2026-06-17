import { motion } from 'framer-motion'
import { MapPin, Target, CheckCircle, Circle, ArrowRight } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { Link } from 'react-router-dom'

const CareerRoadmap = () => {
  const roadmap = [
    { phase: 'Current', title: 'Mid-Level Developer', status: 'complete', skills: ['React', 'Node.js', 'TypeScript'] },
    { phase: 'Next 3 Months', title: 'Senior Developer Track', status: 'current', skills: ['System Design', 'GraphQL', 'Docker'] },
    { phase: 'Next 6 Months', title: 'Tech Lead Prep', status: 'upcoming', skills: ['Team Leadership', 'Architecture', 'Mentoring'] },
    { phase: 'Next Year', title: 'Tech Lead', status: 'future', skills: ['Strategic Planning', 'Stakeholder Management'] }
  ]

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] pb-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Career Roadmap</h1>
          <p className="text-gray-400 mb-8">Your personalized path to career growth</p>

          <div className="space-y-6">
            {roadmap.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#111111] border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    item.status === 'complete' ? 'border-green-500 bg-green-500/10' :
                    item.status === 'current' ? 'border-[#6366f1] bg-[#6366f1]/10' :
                    'border-gray-700 bg-gray-800/10'
                  }`}>
                    {item.status === 'complete' ? (
                      <CheckCircle className="text-green-400" size={24} />
                    ) : (
                      <Circle className={item.status === 'current' ? 'text-[#6366f1]' : 'text-gray-600'} size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm text-gray-400 block mb-1">{item.phase}</span>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      </div>
                      {item.status === 'current' && (
                        <span className="px-3 py-1 bg-[#6366f1]/10 border border-[#6366f1]/20 text-[#6366f1] text-sm font-bold rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill, sidx) => (
                        <span key={sidx} className="px-3 py-1 bg-[#1a1a1a] border border-gray-800 rounded-lg text-sm text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Link to="/skill-gap-analysis" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#111111] hover:bg-[#1a1a1a] border border-gray-800 text-white rounded-xl transition-colors font-medium">
              Skill Gap Analysis
              <ArrowRight size={18} />
            </Link>
            <Link to="/learning" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-xl transition-colors font-medium">
              Start Learning
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CareerRoadmap
