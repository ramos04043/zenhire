import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/themeStore'
import { useAuthStore } from './store/authStore'
import { useDataStore } from './store/dataStore'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DashboardV2 from './pages/DashboardV2'
import Resume from './pages/Resume'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import Applications from './pages/Applications'
import Jobs from './pages/Jobs'
import Settings from './pages/Settings'
import OnboardingWizard from './components/OnboardingWizard'
import ResumeOptimization from './pages/ResumeOptimization'
import StartupJobs from './pages/StartupJobs'
import DreamCompanies from './pages/DreamCompanies'
import ProtectedRoute from './components/ProtectedRoute'

// New pages
import JobDetails from './pages/JobDetails'
import CompanyDetails from './pages/CompanyDetails'
import SavedJobs from './pages/SavedJobs'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import About from './pages/About'
import Contact from './pages/Contact'
import HelpCenter from './pages/HelpCenter'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Messages from './pages/Messages'
import CareerInsights from './pages/CareerInsights'
import SkillGapAnalysis from './pages/SkillGapAnalysis'
import CareerRoadmap from './pages/CareerRoadmap'
import InterviewPreparation from './pages/InterviewPreparation'
import VoiceInterview from './pages/VoiceInterview'
import JobAlerts from './pages/JobAlerts'
import CoverLetterGenerator from './pages/CoverLetterGenerator'
import ResumeVersions from './pages/ResumeVersions'
import AIJobMatch from './pages/AIJobMatch'
import SalaryInsights from './pages/SalaryInsights'
import AICareerCoach from './pages/AICareerCoach'
import Portfolio from './pages/Portfolio'
import PublicProfile from './pages/PublicProfile'
import LearningCenter from './pages/LearningCenter'
import Interviews from './pages/Interviews'
import Offers from './pages/Offers'
import PrivacySecurity from './pages/PrivacySecurity'
import Billing from './pages/Billing'
import Feedback from './pages/Feedback'
import AIResumeBuilder from './pages/AIResumeBuilder'
import Certifications from './pages/Certifications'
import CareerGoals from './pages/CareerGoals'
import RecruiterProfile from './pages/RecruiterProfile'
import NotFound from './pages/NotFound'
import ServerError from './pages/ServerError'
import Maintenance from './pages/Maintenance'

function App() {
  const theme = useThemeStore(state => state.theme)
  const initTheme = useThemeStore(state => state.initTheme)
  const initAuth = useAuthStore(state => state.initAuth)
  const initData = useDataStore(state => state.init)
  const { isAuthenticated, user, isLoading } = useAuthStore()

  useEffect(() => {
    console.log('App Auth State:', { isAuthenticated, userId: user?.id, isLoading })
  }, [isAuthenticated, user, isLoading])

  useEffect(() => {
    initTheme()
    initAuth()
  }, [initTheme, initAuth])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      initData(user.id)
    }
  }, [isAuthenticated, user?.id, initData])

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
      document.body.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    }
  }, [theme])

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Error Pages */}
        <Route path="/404" element={<NotFound />} />
        <Route path="/500" element={<ServerError />} />
        <Route path="/maintenance" element={<Maintenance />} />
        
        {/* Protected Routes - Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardV2 />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard-old" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Resume */}
        <Route path="/resume" element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        } />
        
        <Route path="/resume-analyzer" element={
          <ProtectedRoute>
            <ResumeAnalyzer />
          </ProtectedRoute>
        } />

        <Route path="/optimize" element={
          <ProtectedRoute>
            <ResumeOptimization />
          </ProtectedRoute>
        } />

        <Route path="/resume-versions" element={
          <ProtectedRoute>
            <ResumeVersions />
          </ProtectedRoute>
        } />

        <Route path="/ai-resume-builder" element={
          <ProtectedRoute>
            <AIResumeBuilder />
          </ProtectedRoute>
        } />

        <Route path="/cover-letter-generator" element={
          <ProtectedRoute>
            <CoverLetterGenerator />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Jobs */}
        <Route path="/jobs" element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        } />

        <Route path="/jobs/:id" element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        } />

        <Route path="/startup-jobs" element={
          <ProtectedRoute>
            <StartupJobs />
          </ProtectedRoute>
        } />

        <Route path="/saved-jobs" element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        } />

        <Route path="/job-alerts" element={
          <ProtectedRoute>
            <JobAlerts />
          </ProtectedRoute>
        } />

        <Route path="/ai-job-match" element={
          <ProtectedRoute>
            <AIJobMatch />
          </ProtectedRoute>
        } />

        <Route path="/salary-insights" element={
          <ProtectedRoute>
            <SalaryInsights />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Applications */}
        <Route path="/applications" element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        } />

        <Route path="/interviews" element={
          <ProtectedRoute>
            <Interviews />
          </ProtectedRoute>
        } />

        <Route path="/offers" element={
          <ProtectedRoute>
            <Offers />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Companies */}
        <Route path="/companies/:id" element={
          <ProtectedRoute>
            <CompanyDetails />
          </ProtectedRoute>
        } />

        <Route path="/dream-companies" element={
          <ProtectedRoute>
            <DreamCompanies />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Profile */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route path="/public-profile" element={
          <ProtectedRoute>
            <PublicProfile />
          </ProtectedRoute>
        } />

        <Route path="/portfolio" element={
          <ProtectedRoute>
            <Portfolio />
          </ProtectedRoute>
        } />

        <Route path="/certifications" element={
          <ProtectedRoute>
            <Certifications />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Career Development */}
        <Route path="/career-insights" element={
          <ProtectedRoute>
            <CareerInsights />
          </ProtectedRoute>
        } />

        <Route path="/career-roadmap" element={
          <ProtectedRoute>
            <CareerRoadmap />
          </ProtectedRoute>
        } />

        <Route path="/career-goals" element={
          <ProtectedRoute>
            <CareerGoals />
          </ProtectedRoute>
        } />

        <Route path="/skill-gap-analysis" element={
          <ProtectedRoute>
            <SkillGapAnalysis />
          </ProtectedRoute>
        } />

        <Route path="/interview-preparation" element={
          <ProtectedRoute>
            <InterviewPreparation />
          </ProtectedRoute>
        } />

        <Route path="/voice-interview" element={
          <ProtectedRoute>
            <VoiceInterview />
          </ProtectedRoute>
        } />

        <Route path="/learning-center" element={
          <ProtectedRoute>
            <LearningCenter />
          </ProtectedRoute>
        } />

        <Route path="/ai-career-coach" element={
          <ProtectedRoute>
            <AICareerCoach />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Communication */}
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

        <Route path="/recruiter/:id" element={
          <ProtectedRoute>
            <RecruiterProfile />
          </ProtectedRoute>
        } />
        
        {/* Protected Routes - Settings */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/settings/privacy-security" element={
          <ProtectedRoute>
            <PrivacySecurity />
          </ProtectedRoute>
        } />

        <Route path="/settings/billing" element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        } />

        <Route path="/feedback" element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        } />

        {/* Protected Routes - Onboarding */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingWizard />
          </ProtectedRoute>
        } />
        
        {/* Catch All - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
