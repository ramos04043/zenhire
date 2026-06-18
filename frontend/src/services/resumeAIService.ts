import { API_BASE } from '../lib/api'
import { zendbx } from '../lib/zendbx'
import { zendbxService } from './ZendBXService'

export interface AIResumeAnalysis {
  atsScore: number
  summary: string
  skills: string[]
  experience: any[]
  education: any[]
  missingKeywords: string[]
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  jobMatchScore: number
}

export interface FullResumeAnalysis {
  filename: string
  parsed_data: Record<string, any>
  ats_analysis: {
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
  bucket_path?: string | null
  resume_id?: number
  message: string
}

class ResumeAIService {
  /**
   * 1. Upload file to ZendBX storage bucket (authenticated, from frontend)
   * 2. Send file to local backend for Groq AI analysis
   * 3. Return combined result
   */
  async analyzeResume(file: File): Promise<FullResumeAnalysis> {
    // ── Step 1: Upload to ZendBX bucket ──────────────────────────────────
    let bucketPath: string | null = null
    try {
      console.log('[ResumeAIService] uploading to ZendBX bucket...')
      const { data, error } = await zendbx.storage.bucket('resume').upload(file, file.name)
      if (error) {
        console.warn('[ResumeAIService] bucket upload failed (non-fatal):', error)
      } else {
        bucketPath = (data as any)?.path || (data as any)?.name || file.name
        console.log('[ResumeAIService] stored in bucket:', bucketPath)
      }
    } catch (e) {
      console.warn('[ResumeAIService] bucket upload exception (non-fatal):', e)
    }

    // ── Step 2: Send to local backend for AI analysis ─────────────────────
    console.log('[ResumeAIService] sending to backend for analysis...')
    const formData = new FormData()
    formData.append('file', file)
    if (bucketPath) formData.append('bucket_path', bucketPath)

    const token = localStorage.getItem('access_token')
    const headers: HeadersInit = {}
    if (token) headers['Authorization'] = `Bearer ${token}`

    const response = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const responseText = await response.text()
    if (!response.ok) {
      let detail = responseText
      try { detail = JSON.parse(responseText).detail || responseText } catch { /* keep raw */ }
      console.error('[ResumeAIService] backend error', response.status, detail)
      throw new Error(detail || `Backend returned ${response.status}`)
    }

    const result = JSON.parse(responseText) as FullResumeAnalysis
    result.bucket_path = result.bucket_path || bucketPath
    console.log('[ResumeAIService] analysis complete, bucket_path:', result.bucket_path)

    // ── Step 3: Save record to ZendBX DB ─────────────────────────────────
    try {
      await zendbxService.createResume({
        filename: file.name,
        file_path: bucketPath || file.name,
        is_primary: false,
      })
      console.log('[ResumeAIService] saved to ZendBX resumes table')
    } catch (e) {
      console.warn('[ResumeAIService] ZendBX DB save failed (non-fatal):', e)
    }

    return result
  }

  /** Flat shape — used by ResumeAnalyzer.tsx standalone page. */
  async analyzeFile(file: File): Promise<AIResumeAnalysis> {
    const full = await this.analyzeResume(file)
    return {
      atsScore: full.ats_analysis.score,
      summary: full.parsed_data?.summary ?? '',
      skills: full.parsed_data?.skills ?? [],
      experience: full.parsed_data?.experience ?? [],
      education: full.parsed_data?.education ?? [],
      missingKeywords: full.ats_analysis.keyword_analysis.missing_skills,
      strengths: full.ats_analysis.strengths,
      weaknesses: full.ats_analysis.weaknesses,
      recommendations: full.ats_analysis.recommendations,
      jobMatchScore: full.ats_analysis.keyword_analysis.match_percentage,
    }
  }
}

export const resumeAIService = new ResumeAIService()

