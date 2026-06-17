import { useMemo } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useDataStore } from '../store/dataStore'
import { useAuthStore } from '../store/authStore'
import { useOnboardingStore } from '../store/onboardingStore'
import TopBar from '../components/dashboard-v2/TopBar'
import StatCards from '../components/dashboard-v2/StatCards'
import AIJobMatches from '../components/dashboard-v2/AIJobMatches'
import RecentActivityPipeline from '../components/dashboard-v2/RecentActivityPipeline'
import LiveActivityPanel from '../components/dashboard-v2/LiveActivityPanel'
import ATSPerformance from '../components/dashboard-v2/ATSPerformance'
import SkillGaps from '../components/dashboard-v2/SkillGaps'
import ResumeOptimizationWidget from '../components/dashboard-v2/ResumeOptimizationWidget'

const DashboardV2 = () => {
  const applications = useDataStore(state => state.applications)
  const savedJobs = useDataStore(state => state.savedJobs)
  const resumes = useDataStore(state => state.resumes)
  const { user } = useAuthStore()
  const { profile, scrapedJobs } = useOnboardingStore()

  const stats = useMemo(() => {
    const totalApps = applications.length
    const interviews = applications.filter(a => a.status === 'interview').length
    const saved = savedJobs.length
    // ATS score from onboarding profile (from resume analysis) or fallback to DB resume
    const atsScore = profile.atsScore || (resumes.length > 0 ? (resumes[0]?.ats_score || 0) : 0)

    return {
      applications: totalApps,
      activeSearches: scrapedJobs.length,
      interviews,
      savedJobs: saved,
      atsScore,
    }
  }, [applications, savedJobs, resumes, profile.atsScore, scrapedJobs.length])

  const userName = user?.full_name || 'Candidate'

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0a0a0a] p-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Top Bar */}
          <TopBar userName={userName} />

          {/* Stat Cards Row */}
          <StatCards
            applications={stats.applications}
            activeSearches={stats.activeSearches}
            interviews={stats.interviews}
            savedJobs={stats.savedJobs}
          />

          {/* AI Job Matches */}
          <AIJobMatches />

          {/* Bottom Row - 3 Columns */}
          <div className="grid grid-cols-3 gap-3">
            {/* Column 1 - Recent Activity + Pipeline */}
            <RecentActivityPipeline />

            {/* Column 2 - Live Activity */}
            <LiveActivityPanel />

            {/* Column 3 - ATS Performance + Skill Gaps + Optimization */}
            <div className="flex flex-col gap-3">
              <ATSPerformance score={stats.atsScore} />
              <SkillGaps />
              <ResumeOptimizationWidget />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardV2
