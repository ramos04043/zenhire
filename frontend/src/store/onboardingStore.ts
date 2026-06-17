import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CandidateProfile {
  // From resume
  fullName?: string
  email?: string
  phone?: string
  skills: string[]
  yearsOfExperience?: number
  education?: any[]
  certifications?: string[]
  currentJobTitle?: string
  previousCompanies?: string[]
  languages?: string[]
  resumeSummary?: string
  atsScore?: number
  missingKeywords?: string[]
  strengths?: string[]
  weaknesses?: string[]

  // From wizard
  desiredJobTitle?: string
  workMode?: 'remote' | 'hybrid' | 'on-site' | 'no-preference'
  preferredLocations: string[]
  experienceLevel?: 'fresher' | '1-3' | '3-5' | '5-8' | '8+'
  salaryMin?: number
  salaryMax?: number
  noticePeriod?: 'immediately' | '15-days' | '30-days' | '60-days' | '90-days'
  employmentType?: 'full-time' | 'internship' | 'contract' | 'freelance' | 'part-time'
  preferredIndustries: string[]
  preferredCompanies: string[]

  // Meta
  onboardingComplete: boolean
  resumeAnalyzed: boolean
}

export interface ScrapedJob {
  id: string
  title: string
  company: string
  location: string
  salary?: string | null
  summary?: string | null
  url: string
  source: string
  matchScore: number
  matchingSkills: string[]
  missingSkills: string[]
  matchReasons: string[]
}

interface OnboardingState {
  // Wizard
  currentStep: number
  totalSteps: number
  isWizardOpen: boolean
  isSearchingJobs: boolean

  // Profile
  profile: CandidateProfile

  // Jobs
  scrapedJobs: ScrapedJob[]
  jobsLastFetched: string | null

  // Actions
  openWizard: () => void
  closeWizard: () => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateProfile: (updates: Partial<CandidateProfile>) => void
  setProfileFromResume: (analysisResult: any) => void
  completeOnboarding: () => void
  setScrapedJobs: (jobs: ScrapedJob[]) => void
  setIsSearchingJobs: (v: boolean) => void
  resetOnboarding: () => void
}

const defaultProfile: CandidateProfile = {
  skills: [],
  preferredLocations: [],
  preferredIndustries: [],
  preferredCompanies: [],
  onboardingComplete: false,
  resumeAnalyzed: false,
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 1,
      totalSteps: 10,
      isWizardOpen: false,
      isSearchingJobs: false,
      profile: defaultProfile,
      scrapedJobs: [],
      jobsLastFetched: null,

      openWizard: () => set({ isWizardOpen: true, currentStep: 1 }),
      closeWizard: () => set({ isWizardOpen: false }),
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set(s => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
      prevStep: () => set(s => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

      updateProfile: (updates) =>
        set(s => ({ profile: { ...s.profile, ...updates } })),

      setProfileFromResume: (result) => {
        const parsed = result.parsed_data || {}
        const ats = result.ats_analysis || {}
        const exp = parsed.experience || []

        // Infer years of experience from experience array
        let yearsOfExperience: number | undefined
        if (exp.length > 0) {
          yearsOfExperience = Math.min(exp.length * 2, 15)
        }

        // Infer experience level
        let experienceLevel: CandidateProfile['experienceLevel']
        if (yearsOfExperience === undefined || yearsOfExperience === 0) experienceLevel = 'fresher'
        else if (yearsOfExperience <= 3) experienceLevel = '1-3'
        else if (yearsOfExperience <= 5) experienceLevel = '3-5'
        else if (yearsOfExperience <= 8) experienceLevel = '5-8'
        else experienceLevel = '8+'

        const currentTitle = exp[0]?.title || ''
        const previousCompanies = exp.map((e: any) => e.company).filter(Boolean)

        set(s => ({
          profile: {
            ...s.profile,
            fullName: parsed.name || s.profile.fullName,
            email: parsed.email || s.profile.email,
            phone: parsed.phone || s.profile.phone,
            skills: parsed.skills || s.profile.skills,
            education: parsed.education || s.profile.education,
            certifications: parsed.certifications || s.profile.certifications,
            currentJobTitle: currentTitle || s.profile.currentJobTitle,
            previousCompanies,
            languages: parsed.languages || s.profile.languages,
            resumeSummary: parsed.summary || s.profile.resumeSummary,
            atsScore: ats.score,
            missingKeywords: ats.keyword_analysis?.missing_skills || [],
            strengths: ats.strengths || [],
            weaknesses: ats.weaknesses || [],
            yearsOfExperience,
            experienceLevel: s.profile.experienceLevel || experienceLevel,
            desiredJobTitle: s.profile.desiredJobTitle || currentTitle,
            resumeAnalyzed: true,
          }
        }))
      },

      completeOnboarding: () =>
        set(s => ({ profile: { ...s.profile, onboardingComplete: true }, isWizardOpen: false })),

      setScrapedJobs: (jobs) => set({ scrapedJobs: jobs, jobsLastFetched: new Date().toISOString() }),
      setIsSearchingJobs: (v) => set({ isSearchingJobs: v }),

      resetOnboarding: () => set({
        currentStep: 1,
        isWizardOpen: false,
        profile: defaultProfile,
        scrapedJobs: [],
        jobsLastFetched: null,
      }),
    }),
    {
      name: 'zenhire-onboarding',
      version: 2,  // bump to clear stale jobs from removed providers
      migrate: (persistedState: any, version: number) => {
        if (version < 2) {
          // Wipe scraped jobs — they came from old providers (Remotive, Arbeitnow etc.)
          return { ...persistedState, scrapedJobs: [], jobsLastFetched: null }
        }
        return persistedState
      },
      partialize: (s) => ({ profile: s.profile, scrapedJobs: s.scrapedJobs, jobsLastFetched: s.jobsLastFetched }),
    }
  )
)
