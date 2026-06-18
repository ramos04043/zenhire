import { createClient } from '@zendbx/sdk'

// ── Config validation ─────────────────────────────────────────────────────────

const ZENDBX_URL      = import.meta.env.VITE_ZENDBX_URL
const ZENDBX_ANON_KEY = import.meta.env.VITE_ZENDBX_ANON_KEY

if (!ZENDBX_URL) {
  throw new Error(
    '[ZenHire] Missing VITE_ZENDBX_URL environment variable. ' +
    'Set it to a full URL, e.g. https://api.zendbx.in'
  )
}

if (!ZENDBX_ANON_KEY) {
  throw new Error(
    '[ZenHire] Missing VITE_ZENDBX_ANON_KEY environment variable.'
  )
}

// Validate it is an absolute URL (starts with http:// or https://)
if (!/^https?:\/\/.+/.test(ZENDBX_URL)) {
  throw new Error(
    `[ZenHire] Invalid ZendBX API URL: "${ZENDBX_URL}". ` +
    'Expected a full URL such as https://api.zendbx.in'
  )
}

// ── SDK client ────────────────────────────────────────────────────────────────

export const zendbx = createClient({
  apiUrl:  ZENDBX_URL,
  anonKey: ZENDBX_ANON_KEY,
})

// ── Database Tables ───────────────────────────────────────────────────────────

export const TABLES = {
  USERS:                      'users',
  PROFILES:                   'profiles',
  RESUMES:                    'resumes',
  SKILLS:                     'skills',
  EDUCATION:                  'education',
  EXPERIENCE:                 'experience',
  CERTIFICATIONS:             'certifications',
  ATS_SCORES:                 'ats_scores',
  APPLICATIONS:               'applications',
  APPLICATION_STATUS_HISTORY: 'application_status_history',
  JOBS:                       'jobs',
  SAVED_JOBS:                 'saved_jobs',
  NOTIFICATIONS:              'notifications',
  SETTINGS:                   'settings',
} as const

// ── Type Definitions ──────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  full_name?: string
  role: 'candidate' | 'recruiter' | 'admin'
  login_count: number
  profile_completion_rate: number
  last_prompt_dismissed_at?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  phone?: string
  location?: string
  title?: string
  bio?: string
  linkedin_url?: string
  github_url?: string
  portfolio_url?: string
  avatar_url?: string
  is_complete: boolean
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  filename: string
  file_path: string
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
  is_primary?: boolean
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at?: string
}

export interface ATSScore {
  id: string
  resume_id: string
  score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  keyword_analysis: {
    matching_skills: string[]
    missing_skills: string[]
    match_percentage: number
  }
  created_at: string
}

export interface Application {
  id: string
  user_id: string
  company: string
  position: string
  location?: string
  salary_range?: string
  job_url?: string
  status: 'applied' | 'viewed' | 'downloaded' | 'shortlisted' | 'interview' | 'offer' | 'rejected'
  notes?: string
  applied_date: string
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary_min: number
  salary_max: number
  description?: string
  required_skills: string[]
  job_type: string
  experience_level: string
  posted_date: string
  created_at: string
}

export interface SavedJob {
  id: string
  user_id: string
  job_id: string
  match_score: number
  matching_skills: string[]
  missing_skills: string[]
  is_applied: boolean
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'status_change' | 'ats_score' | 'resume_upload' | 'job_saved' | 'recruiter_activity' | 'system'
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Settings {
  id: string
  user_id: string
  theme: 'light' | 'dark'
  demo_mode_enabled: boolean
  email_notifications: boolean
  push_notifications: boolean
  created_at: string
}

export interface JobPreferences {
  role_preferences: string[]
  salary_min: number
  salary_max: number
  preferred_locations: { country: string; state?: string; city?: string }[]
  work_arrangement: ('remote' | 'hybrid' | 'on-site')[]
  experience_level: ('entry' | 'mid' | 'senior' | 'lead')[]
  job_type: ('full-time' | 'part-time' | 'contract' | 'internship')[]
}
