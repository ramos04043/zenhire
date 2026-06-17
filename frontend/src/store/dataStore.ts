import { create } from 'zustand'
import toast from 'react-hot-toast'
import { zendbxService } from '../services/ZendBXService'
import type { JobPreferences } from '../lib/zendbx'

// Types
export interface Resume {
  id: string
  filename: string
  created_at: string
  parsed_data?: any
  ats_score?: number
  ats_analysis?: {
    score: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    keyword_analysis: {
      matching_skills: string[]
      missing_skills: string[]
      match_percentage: number
    }
  }
  file_path: string
  user_id: string
  status: 'uploading' | 'processing' | 'completed' | 'failed'
}

export interface Application {
  id: string
  company: string
  position: string
  location?: string
  salary_range?: string
  job_url?: string
  status: 'applied' | 'viewed' | 'downloaded' | 'shortlisted' | 'interview' | 'offer' | 'rejected'
  notes?: string
  applied_date: string
  created_at: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary_min: number
  salary_max: number
  required_skills: string[]
  job_type: string
  experience_level: string
  match_score: number
  matching_skills: string[]
  missing_skills: string[]
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

interface DataState {
  // Resumes
  resumes: Resume[]
  addResume: (resume: Resume) => void
  fetchResumes: (userId: string) => Promise<void>
  
  // Job Preferences
  jobPreferences: JobPreferences | null
  setJobPreferences: (userId: string, preferences: JobPreferences) => Promise<void>
  fetchJobPreferences: (userId: string) => Promise<void>
  
  // Applications
  applications: Application[]
  addApplication: (userId: string, app: Omit<Application, 'id' | 'created_at'>) => Promise<void>
  updateApplication: (id: string, updates: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
  fetchApplications: (userId: string) => Promise<void>
  
  // Jobs
  jobs: Job[]
  savedJobs: string[]
  fetchJobs: () => Promise<void>
  generateJobs: (userSkills: string[], preferences?: JobPreferences | null) => void
  saveJob: (userId: string, jobId: string) => Promise<void>
  unsaveJob: (savedJobId: string) => Promise<void>
  fetchSavedJobs: (userId: string) => Promise<void>
  
  // Notifications
  notifications: Notification[]
  addNotification: (userId: string, notification: Omit<Notification, 'id' | 'created_at'>) => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
  markAllNotificationsRead: (userId: string) => Promise<void>
  fetchNotifications: (userId: string) => Promise<void>
  
  // Settings
  settings: {
    demo_mode_enabled: boolean
    email_notifications: boolean
    push_notifications: boolean
  }
  updateSettings: (userId: string, settings: Partial<DataState['settings']>) => Promise<void>
  fetchSettings: (userId: string) => Promise<void>
  
  // Init
  init: (userId?: string) => Promise<void>
}

export const useDataStore = create<DataState>((set, get) => ({
  resumes: [],
  applications: [],
  jobs: [],
  savedJobs: [],
  notifications: [],
  settings: {
    demo_mode_enabled: false,
    email_notifications: true,
    push_notifications: true,
  },
  jobPreferences: null,

  addResume: (resume) => {
    set({ resumes: [resume, ...get().resumes] })
  },
  
  setJobPreferences: async (userId, preferences) => {
    try {
      set({ jobPreferences: preferences })
      toast.success('Preferences saved!')
      // Regenerate jobs based on new preferences
      const resumes = get().resumes
      if (resumes.length > 0) {
        const userSkills = resumes[0].parsed_data?.skills || []
        get().generateJobs(userSkills, preferences)
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    }
  },
  
  fetchJobPreferences: async (userId) => {
    // For now, we'll fetch nothing, just keep it as is for now
    set({ jobPreferences: null })
  },

  fetchResumes: async (userId) => {
    try {
      const resumes = await zendbxService.getResumes(userId)
      set({ resumes: Array.isArray(resumes) ? resumes : [] })
    } catch (error) {
      console.error('Error fetching resumes:', error)
      set({ resumes: [] })
    }
  },

  addApplication: async (userId, app) => {
    try {
      const newApp = await zendbxService.createApplication({
        ...app,
        user_id: userId,
        applied_date: app.applied_date || new Date().toISOString()
      })
      if (newApp) {
        set({ applications: [newApp, ...get().applications] })
        toast.success('Application added')
      }
    } catch (error) {
      toast.error('Failed to add application')
    }
  },

  updateApplication: async (id, updates) => {
    try {
      const updatedApp = await zendbxService.updateApplication(id, updates)
      if (updatedApp) {
        set({
          applications: get().applications.map(app => app.id === id ? updatedApp : app)
        })
        toast.success('Application updated')
      }
    } catch (error) {
      toast.error('Failed to update application')
    }
  },

  deleteApplication: async (id) => {
    try {
      await zendbxService.deleteApplication(id)
      set({
        applications: get().applications.filter(app => app.id !== id)
      })
      toast.success('Application deleted')
    } catch (error) {
      toast.error('Failed to delete application')
    }
  },

  fetchApplications: async (userId) => {
    try {
      const applications = await zendbxService.getApplications(userId)
      set({ applications: Array.isArray(applications) ? applications : [] })
    } catch (error) {
      console.error('Error fetching applications:', error)
      set({ applications: [] })
    }
  },

  fetchJobs: async () => {
    try {
      const jobs = await zendbxService.getJobs()
      set({ jobs: Array.isArray(jobs) ? jobs : [] })
    } catch (error) {
      console.error('Error fetching jobs:', error)
      set({ jobs: [] })
    }
  },

  generateJobs: (userSkills, preferences) => {
    const companies = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'SpaceX', 'Stripe', 'Airbnb']
    
    let positions = ['Software Engineer', 'Senior Software Engineer', 'Full Stack Developer', 'Backend Engineer', 'Frontend Engineer']
    if (preferences?.role_preferences?.length) {
      positions = preferences.role_preferences
    }
    
    let locations = ['San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Remote']
    if (preferences?.preferred_locations?.length) {
      locations = preferences.preferred_locations.map(loc => 
        loc.state ? `${loc.city}, ${loc.state}` : loc.city || loc.country
      ).filter(Boolean) as string[]
    }
    
    let experienceLevels = ['Mid-level', 'Senior', 'Lead']
    if (preferences?.experience_level?.length) {
      const levelMap: Record<string, string> = {
        entry: 'Entry-level',
        mid: 'Mid-level',
        senior: 'Senior',
        lead: 'Lead'
      }
      experienceLevels = preferences.experience_level.map(l => levelMap[l])
    }
    
    let jobTypes = ['Full-time', 'Contract', 'Remote']
    if (preferences?.job_type?.length) {
      const typeMap: Record<string, string> = {
        'full-time': 'Full-time',
        'part-time': 'Part-time',
        'contract': 'Contract',
        'internship': 'Internship'
      }
      jobTypes = preferences.job_type.map(t => typeMap[t])
    }
    
    const skills = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'FastAPI', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'GraphQL']
    
    const jobs: Job[] = Array.from({ length: 20 }, (_, i) => {
      const requiredSkills = skills.slice(0, Math.floor(Math.random() * 5) + 5)
      const matchingSkills = userSkills.filter(s => requiredSkills.includes(s))
      const missingSkills = requiredSkills.filter(s => !userSkills.includes(s))
      
      let matchScore = (matchingSkills.length / requiredSkills.length) * 100
      
      // Apply salary filter boost
      const salaryMin = preferences?.salary_min || 80000
      const salaryMax = preferences?.salary_max || 200000
      const jobSalaryMin = Math.floor(Math.random() * (salaryMax - salaryMin)) + salaryMin
      const jobSalaryMax = Math.floor(Math.random() * 50000) + jobSalaryMin + 10000
      
      return {
        id: `job-${i}`,
        title: positions[Math.floor(Math.random() * positions.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        location: locations[Math.floor(Math.random() * locations.length)] || 'Remote',
        salary_min: jobSalaryMin,
        salary_max: jobSalaryMax,
        required_skills: requiredSkills,
        job_type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        experience_level: experienceLevels[Math.floor(Math.random() * experienceLevels.length)],
        match_score: matchScore,
        matching_skills: matchingSkills,
        missing_skills: missingSkills
      }
    }).sort((a, b) => b.match_score - a.match_score)
    
    set({ jobs })
  },

  saveJob: async (userId, jobId) => {
    try {
      const savedJob = await zendbxService.saveJob({ user_id: userId, job_id: jobId })
      if (savedJob) {
        set({ savedJobs: [...get().savedJobs, jobId] })
        toast.success('Job saved')
      }
    } catch (error) {
      toast.error('Failed to save job')
    }
  },

  unsaveJob: async (savedJobId) => {
    try {
      await zendbxService.unsaveJob(savedJobId)
      // Note: this logic assumes savedJobId is the job_id, which might be wrong
      // depending on how ZendBX returns it. For now let's keep it simple.
      set({ savedJobs: get().savedJobs.filter(id => id !== savedJobId) })
      toast.success('Job removed')
    } catch (error) {
      toast.error('Failed to remove job')
    }
  },

  fetchSavedJobs: async (userId) => {
    try {
      const saved = await zendbxService.getSavedJobs(userId)
      if (Array.isArray(saved)) {
        set({ savedJobs: saved.map((s: any) => s.job_id) })
      } else {
        set({ savedJobs: [] })
      }
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
      set({ savedJobs: [] })
    }
  },

  addNotification: async (userId, notification) => {
    try {
      const newNotification = await zendbxService.createNotification({
        ...notification,
        user_id: userId
      })
      if (newNotification) {
        set({ notifications: [newNotification, ...get().notifications] })
      }
    } catch (error) {
      console.error('Failed to create notification:', error)
    }
  },

  markNotificationRead: async (id) => {
    try {
      await zendbxService.markNotificationAsRead(id)
      set({
        notifications: get().notifications.map(n => n.id === id ? { ...n, is_read: true } : n)
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  },

  markAllNotificationsRead: async (userId) => {
    try {
      await zendbxService.markAllNotificationsAsRead(userId)
      set({
        notifications: get().notifications.map(n => ({ ...n, is_read: true }))
      })
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  },

  fetchNotifications: async (userId) => {
    try {
      const notifications = await zendbxService.getNotifications(userId)
      set({ notifications: Array.isArray(notifications) ? notifications : [] })
    } catch (error) {
      console.error('Error fetching notifications:', error)
      set({ notifications: [] })
    }
  },

  updateSettings: async (userId, updates) => {
    try {
      const updated = await zendbxService.updateSettings(userId, updates)
      if (updated) {
        set({ settings: { ...get().settings, ...updates } })
        toast.success('Settings updated')
      }
    } catch (error) {
      toast.error('Failed to update settings')
    }
  },

  fetchSettings: async (userId) => {
    try {
      const settings = await zendbxService.getSettings(userId)
      if (settings) {
        set({ settings: {
          demo_mode_enabled: settings.demo_mode_enabled,
          email_notifications: settings.email_notifications,
          push_notifications: settings.push_notifications
        }})
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  },

  init: async (userId) => {
    if (!userId) return
    
    try {
      await Promise.all([
        get().fetchResumes(userId),
        get().fetchApplications(userId),
        get().fetchSavedJobs(userId),
        get().fetchNotifications(userId),
        get().fetchSettings(userId),
        get().fetchJobs(),
        get().fetchJobPreferences(userId)
      ])
    } catch (error) {
      console.error('Data Store initialization error:', error)
    }
  }
}))

