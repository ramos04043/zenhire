import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { Sparkles, TrendingUp, Calendar } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import AICareerCopilot from '../components/dashboard/AICareerCopilot'
import CareerCommandCenter from '../components/dashboard/CareerCommandCenter'
import SmartResumeWidget from '../components/dashboard/SmartResumeWidget'
import RecruiterActivityFeed from '../components/dashboard/RecruiterActivityFeed'
import SmartJobRecommendations from '../components/dashboard/SmartJobRecommendations'
import RealTimeAIAnalyzer from '../components/dashboard/RealTimeAIAnalyzer'
import LiveActivityChart from '../components/dashboard/LiveActivityChart'

const Dashboard = () => {
  const applications = useDataStore(state => state.applications)
  const jobs = useDataStore(state => state.jobs)
  const savedJobs = useDataStore(state => state.savedJobs)
  const resumes = useDataStore(state => state.resumes)
  const { user } = useAuthStore()

  // Calculate stats
  const stats = useMemo(() => {
    const atsScore = resumes.length > 0 ? (resumes[0]?.ats_score || 75) : 0
    const totalApps = applications.length
    const interviews = applications.filter(a => a.status === 'interview').length
    const profileViews = 12 // Mock data
    const matchScore = jobs.length > 0 ? Math.max(...jobs.map(j => j.match_score || 0)) : 0
    const skillsOptimized = 8 // Mock data

    return {
      atsScore,
      applications: totalApps,
      interviews,
      profileViews,
      matchScore,
      skillsOptimized
    }
  }, [applications, jobs, resumes])

  // Get greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Get first name
  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Personalized Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-5xl font-bold text-white mb-3">
                {getGreeting()}, {firstName} 👋
              </h1>
              <p className="text-xl text-dark-text-secondary">
                You're closer to your next opportunity.
              </p>
            </div>
          </div>

          {/* Today's AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 bg-gradient-to-r from-dark-accent/10 to-purple-500/10 border border-dark-accent/20 rounded-3xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={20} className="text-dark-accent" />
              <h3 className="font-bold text-white">Today's AI Summary</h3>
            </div>
            <ul className="space-y-2 text-dark-text-secondary">
              <li className="flex items-center gap-3">
                <TrendingUp size={16} className="text-green-500" />
                <span>ATS score improved by <span className="text-white font-semibold">12%</span></span>
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp size={16} className="text-blue-500" />
                <span><span className="text-white font-semibold">3 recruiters</span> viewed your profile</span>
              </li>
              <li className="flex items-center gap-3">
                <Calendar size={16} className="text-purple-500" />
                <span><span className="text-white font-semibold">2 interviews</span> scheduled this week</span>
              </li>
              <li className="flex items-center gap-3">
                <Sparkles size={16} className="text-yellow-500" />
                <span>Resume optimization <span className="text-white font-semibold">available</span></span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Real-Time AI Analyzer & Live Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RealTimeAIAnalyzer />
          <LiveActivityChart />
        </div>

        {/* Career Command Center */}
        <CareerCommandCenter stats={stats} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - AI Copilot */}
          <div className="lg:col-span-2">
            <AICareerCopilot />
          </div>

          {/* Right Column - Resume & Activity */}
          <div className="space-y-6">
            <SmartResumeWidget
              atsScore={stats.atsScore}
              keywordMatch={85}
              missingSkills={['Python', 'AWS']}
              hasResume={resumes.length > 0}
            />
            <RecruiterActivityFeed />
          </div>
        </div>

        {/* Smart Job Recommendations */}
        <SmartJobRecommendations />
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
