import { zendbx, TABLES, type User, type Profile, type Resume, type Application, type Job, type SavedJob, type Notification, type Settings } from '../lib/zendbx'

/**
 * Helper function to extract human-readable error message from error objects
 */
function extractErrorMessage(error: any): string {
  if (!error) {
    return 'Unknown error'
  }
  if (typeof error === 'string') {
    return error
  }
  if (typeof error.message === 'string') {
    return error.message
  }
  if (error.message && typeof error.message === 'object' && typeof error.message.message === 'string') {
    return error.message.message
  }
  if (error.details && typeof error.details === 'object' && error.details.detail) {
    if (typeof error.details.detail === 'string') {
      return error.details.detail
    }
    if (typeof error.details.detail === 'object' && error.details.detail.message) {
      return error.details.detail.message
    }
  }
  return 'Unknown error'
}

/**
 * ZendBX Service Layer
 * All ZendBX operations go through this service
 * Never access zendbx directly from UI components
 */

class ZendBXService {
  // ============= Authentication =============
  
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await zendbx.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'candidate'
        }
      }
    })

    if (error) throw error
    
    // Create initial profile and settings for new user
    if (data.user) {
      await this.createProfile(data.user.id)
      await this.createSettings(data.user.id)
      await this.incrementLoginCount(data.user.id)
    }

    return { user: data.user, session: data.session }
  }
  
  async signIn(email: string, password: string) {
    const { data, error } = await zendbx.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    if (data.user) {
      // Use profile table for login count to ensure compatibility with ZendBX cloud
      await this.incrementLoginCount(data.user.id)
    }

    return { user: data.user, session: data.session }
  }

  async incrementLoginCount(userId: string) {
    // We'll store login count in localStorage as a fallback since the remote 
    // ZendBX schema might not have this column yet.
    const key = `zenhire_login_count_${userId}`
    const currentCount = parseInt(localStorage.getItem(key) || '0')
    const newCount = currentCount + 1
    localStorage.setItem(key, newCount.toString())
    
    console.log(`Login count for ${userId}: ${newCount} (stored in localStorage)`)
  }

  calculateProfileCompletionRate(profile: Profile | null): number {
    if (!profile) return 0
    
    // Use fields we are sure exist in the remote DB
    const fields = [
      'phone', 'location', 'title', 'bio', 
      'linkedin_url', 'github_url', 'portfolio_url', 'avatar_url'
    ]
    
    const completedFields = fields.filter(field => {
      const value = profile[field as keyof Profile]
      return value && typeof value === 'string' && value.trim().length > 0
    })

    return Math.round((completedFields.length / fields.length) * 100)
  }

  async signOut() {
    const { error } = await zendbx.auth.signOut()
    if (error) throw error
  }
  
  async getSession() {
    const { data, error } = await zendbx.auth.getSession()
    if (error) throw error
    return data.session
  }
  
  async getUser() {
    const { data: { user }, error } = await zendbx.auth.getUser()
    if (error) return null
    return user
  }

  async getUserExtendedData(userId: string) {
    // 1. Fetch persistent data from DB (use select('*') to avoid 500 errors if columns are missing)
    const { data, error } = await zendbx
      .from(TABLES.PROFILES)
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching profile data:', error)
      return null
    }

    const profile = data && data.length > 0 ? data[0] : null
    
    // 2. Combine with localStorage for fields that don't exist in the remote DB schema yet
    const loginCount = parseInt(localStorage.getItem(`zenhire_login_count_${userId}`) || '0')
    const completionRate = parseInt(localStorage.getItem(`zenhire_profile_rate_${userId}`) || '0')
    const lastDismissed = localStorage.getItem(`zenhire_prompt_dismissed_${userId}`)

    return {
      login_count: loginCount,
      profile_completion_rate: profile?.is_complete ? 100 : completionRate,
      last_prompt_dismissed_at: lastDismissed || undefined,
      created_at: profile?.created_at || new Date().toISOString(),
      is_profile_complete: profile?.is_complete || false
    }
  }
  
  // ============= Users =============
  
  async getCurrentUserProfile() {
    const user = await this.getUser()
    if (!user) return null

    try {
      console.log('Fetching profile for user:', user.id)
      const { data, error } = await zendbx
        .from(TABLES.PROFILES)
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      const profile = data && data.length > 0 ? data[0] : null
      console.log('Found profile:', profile)
      return profile
    } catch (e) {
      console.error('Failed to get current user profile:', e)
      return null
    }
  }
  
  async updateProfile(userId: string, updates: Partial<Profile>) {
    console.log('Updating profile for user:', userId, updates)
    
    // Calculate completion rate
    const completionRate = this.calculateProfileCompletionRate(updates as Profile)
    
    // Store rate in localStorage for immediate consistency
    localStorage.setItem(`zenhire_profile_rate_${userId}`, completionRate.toString())

    // Filter payload to only include known database columns to avoid 500 errors
    const knownColumns = [
      'phone', 'location', 'title', 'bio', 
      'linkedin_url', 'github_url', 'portfolio_url', 'avatar_url',
      'is_complete', 'user_id'
    ]
    
    const payload: any = {
      user_id: userId,
      is_complete: completionRate === 100,
    }

    knownColumns.forEach(col => {
      if (col in updates) {
        payload[col] = (updates as any)[col]
      }
    })

    // Try to find if profile exists first using select()
    const { data: existing } = await zendbx
      .from(TABLES.PROFILES)
      .select('id')
      .eq('user_id', userId)

    let result;
    if (existing && existing.length > 0) {
      // Update existing
      const { data, error } = await zendbx
        .from(TABLES.PROFILES)
        .update(payload)
        .eq('id', existing[0].id)
        .select()
      
      if (error) {
        console.error('Update profile error:', error)
        throw error
      }
      result = data
    } else {
      // Insert new
      const { data, error } = await zendbx
        .from(TABLES.PROFILES)
        .insert(payload)
        .select()
      
      if (error) {
        console.error('Insert profile error:', error)
        throw error
      }
      result = data
    }

    console.log('Profile update successful')
    return (result && result.length > 0) ? result[0] : { ...payload }
  }
  
  private async createProfile(userId: string) {
    if (!userId) throw new Error('User ID is required to create profile')
    
    const { data, error } = await zendbx
      .from(TABLES.PROFILES)
      .insert({ 
        user_id: userId,
        is_complete: false,
      })
      .select()
    
    if (error) {
      // If it already exists, that's fine
      return null
    }
    return data && data.length > 0 ? data[0] : null
  }
  
  // ============= Resumes =============
  
  async uploadResumeToStorage(userId: string, file: File) {
    console.log('=== ZendBXService.uploadResumeToStorage - Step 1: Check session ===')
    const session = await this.getSession()
    if (!session?.access_token) {
      console.error('=== ZendBXService.uploadResumeToStorage - ERROR: No active session found ===')
      throw new Error('No active session found')
    }

    // Upload file to ZendBX Storage
    const fileName = `${userId}/${Date.now()}_${file.name}`
    console.log('=== ZendBXService.uploadResumeToStorage - Step 2: Uploading file ===', fileName)

    const { data: storageData, error: storageError } = await zendbx.storage
      .bucket('resume')
      .upload(file, fileName)

    if (storageError) {
      console.error('=== ZendBXService.uploadResumeToStorage - ERROR: Storage upload failed ===', storageError)
      throw storageError
    }

    const filePath = storageData?.id ? zendbx.storage.bucket('resume').getPreviewUrl(storageData.id) : ''
    console.log('=== ZendBXService.uploadResumeToStorage - Step 3: SUCCESS! Uploaded to storage ===', { fileId: storageData?.id, fileName, filePath })

    return {
      fileId: storageData?.id,
      fileName: file.name,
      filePath
    }
  }

  async updateResume(resumeId: string, updates: Partial<Resume>) {
    console.log('=== ZendBXService.updateResume - Step 1: Starting update ===', { resumeId, updates })

    // The ZendBX cloud resumes table only has these safe columns.
    // parsed_data, ats_score, ats_analysis, status do NOT exist in the remote schema
    // and will cause HTTP 500 if included in the PATCH payload.
    // updated_at is intentionally excluded — the DB trigger sets it automatically,
    // and sending it manually causes SQLSTATE 42601 (multiple assignments to same column).
    const SAFE_COLUMNS: (keyof Resume)[] = ['filename', 'file_path', 'is_primary']

    const payload: Partial<Resume> = {}
    for (const col of SAFE_COLUMNS) {
      if (col in updates && updates[col] !== undefined) {
        ;(payload as any)[col] = updates[col]
      }
    }

    console.log('=== ZendBXService.updateResume - Step 2: Safe payload ===', payload)

    const { data, error } = await zendbx
      .from(TABLES.RESUMES)
      .update(payload)
      .eq('id', resumeId)
      .select()

    if (error) {
      // Log the COMPLETE error — status, headers, body — so we can diagnose schema mismatches
      console.error('=== ZendBXService.updateResume - ERROR: PATCH /rest/v1/resumes failed ===')
      console.error('  error object:', JSON.stringify(error, null, 2))
      console.error('  error.message:', error.message)
      console.error('  error.details:', error.details)
      console.error('  error.hint:', (error as any).hint)
      console.error('  error.code:', (error as any).code)
      // Do not throw — analysis result is already in local state; DB update is best-effort
      return null
    }

    console.log('=== ZendBXService.updateResume - Step 3: SUCCESS ===', data)
    return data && data.length > 0 ? data[0] : null
  }
  
  async createResume(resume: Omit<Partial<Resume>, 'id' | 'created_at' | 'user_id'>) {
    console.log('=== ZendBXService.createResume - Step 1: Check authentication ===')
    const currentUser = await this.getUser()
    if (!currentUser || !currentUser.id) {
      console.error('=== ZendBXService.createResume - ERROR: User not authenticated ===')
      throw new Error('User not authenticated')
    }
    console.log('=== ZendBXService.createResume - Authenticated user ID:', currentUser.id)

    // Prepare sanitized payload - remove status, ats_analysis since DB might not have them
    const { status, ats_analysis, ...sanitizedResume } = resume
    const sanitizedPayload = {
      ...sanitizedResume,
      user_id: currentUser.id
    }

    console.log('=== ZendBXService.createResume - Step 2: Inserting into DB ===', JSON.stringify(sanitizedPayload, null, 2))

    const { data, error } = await zendbx
      .from(TABLES.RESUMES)
      .insert(sanitizedPayload)
      .select()

    if (error) {
      console.error('=== ZendBXService.createResume - ERROR: Database insert failed ===', JSON.stringify(error, null, 2))
      throw error
    }

    console.log('=== ZendBXService.createResume - Step 3: SUCCESS! Inserted resume ===', data)
    return data && data.length > 0 ? data[0] : null
  }
  
  async getResumes(userId: string) {
    if (!userId) return []
    
    try {
      const { data, error } = await zendbx
        .from(TABLES.RESUMES)
        .select('*')
        .eq('user_id', userId)
      
      if (error) {
        console.error('Error fetching resumes:', error)
        return []
      }
      
      if (data && data.length > 0) {
        return [...data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
      }
      
      return data || []
    } catch (e) {
      console.error('Failed to get resumes:', e)
      return []
    }
  }
  
  async getResumeById(resumeId: string) {
    if (!resumeId) throw new Error('Resume ID is required')
    
    const { data, error } = await zendbx
      .from(TABLES.RESUMES)
      .select('*')
      .eq('id', resumeId)
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  }
  
  // ============= Applications =============
  
  async createApplication(application: Omit<Application, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await zendbx
      .from(TABLES.APPLICATIONS)
      .insert(application)
      .select()
    
    if (error) throw error
    
    const createdApp = data && data.length > 0 ? data[0] : null
    
    if (createdApp) {
      // Create status history entry
      await zendbx
        .from(TABLES.APPLICATION_STATUS_HISTORY)
        .insert({
          application_id: createdApp.id,
          status: application.status,
          changed_at: new Date().toISOString()
        })
    }
    
    return createdApp
  }
  
  async getApplications(userId: string, status?: string) {
    if (!userId) return []
    
    try {
      let query = zendbx
        .from(TABLES.APPLICATIONS)
        .select('*')
        .eq('user_id', userId)
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching applications:', error)
        return []
      }
      
      if (data && data.length > 0) {
        return [...data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
      }
      
      return data || []
    } catch (e) {
      console.error('Failed to get applications:', e)
      return []
    }
  }
  
  async updateApplication(applicationId: string, updates: Partial<Application>) {
    if (!applicationId) throw new Error('Application ID is required')
    
    const { data, error } = await zendbx
      .from(TABLES.APPLICATIONS)
      .update(updates)
      .eq('id', applicationId)
      .select()
    
    if (error) throw error
    
    const updatedApp = data && data.length > 0 ? data[0] : null
    
    // If status changed, add to history
    if (updatedApp && updates.status) {
      await zendbx
        .from(TABLES.APPLICATION_STATUS_HISTORY)
        .insert({
          application_id: applicationId,
          status: updates.status,
          changed_at: new Date().toISOString()
        })
    }
    
    return updatedApp
  }
  
  async deleteApplication(applicationId: string) {
    if (!applicationId) throw new Error('Application ID is required')
    
    const { error } = await zendbx
      .from(TABLES.APPLICATIONS)
      .delete()
      .eq('id', applicationId)
    
    if (error) throw error
  }
  
  async getApplicationStats(userId: string) {
    const applications = await this.getApplications(userId)
    
    const stats = {
      total: applications.length,
      by_status: {
        applied: 0,
        viewed: 0,
        downloaded: 0,
        shortlisted: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
      }
    }
    
    applications.forEach(app => {
      if (app.status in stats.by_status) {
        stats.by_status[app.status as keyof typeof stats.by_status]++
      }
    })
    
    return stats
  }
  
  // ============= Jobs =============
  
  async getJobs() {
    try {
      const { data, error } = await zendbx
        .from(TABLES.JOBS)
        .select('*')
        .limit(50)
      
      if (error) {
        console.error('Error fetching jobs:', error)
        return []
      }
      
      // Sort in memory if needed, to avoid 500 errors if column is missing
      if (data && data.length > 0) {
        return [...data].sort((a, b) => {
          const dateA = a.posted_date ? new Date(a.posted_date).getTime() : 0
          const dateB = b.posted_date ? new Date(b.posted_date).getTime() : 0
          return dateB - dateA
        })
      }
      
      return data || []
    } catch (e) {
      console.error('Failed to get jobs:', e)
      return []
    }
  }
  
  async saveJob(savedJob: Omit<SavedJob, 'id' | 'created_at'>) {
    const { data, error } = await zendbx
      .from(TABLES.SAVED_JOBS)
      .insert(savedJob)
      .select()
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  }
  
  async getSavedJobs(userId: string) {
    if (!userId) return []
    
    try {
      const { data, error } = await zendbx
        .from(TABLES.SAVED_JOBS)
        .select('*, jobs(*)')
        .eq('user_id', userId)
      
      if (error) {
        console.error('Error fetching saved jobs:', error)
        return []
      }
      
      if (data && data.length > 0) {
        return [...data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
      }
      
      return data || []
    } catch (e) {
      console.error('Failed to get saved jobs:', e)
      return []
    }
  }
  
  async unsaveJob(savedJobId: string) {
    if (!savedJobId) throw new Error('Saved Job ID is required')
    
    const { error } = await zendbx
      .from(TABLES.SAVED_JOBS)
      .delete()
      .eq('id', savedJobId)
    
    if (error) throw error
  }
  
  // ============= Notifications =============
  
  async createNotification(notification: Omit<Notification, 'id' | 'created_at'>) {
    const { data, error } = await zendbx
      .from(TABLES.NOTIFICATIONS)
      .insert(notification)
      .select()
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  }
  
  async getNotifications(userId: string) {
    if (!userId) return []
    
    try {
      const { data, error } = await zendbx
        .from(TABLES.NOTIFICATIONS)
        .select('*')
        .eq('user_id', userId)
        .limit(50)
      
      if (error) {
        console.error('Error fetching notifications:', error)
        return []
      }
      
      if (data && data.length > 0) {
        return [...data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
      }
      
      return data || []
    } catch (e) {
      console.error('Failed to get notifications:', e)
      return []
    }
  }
  
  async markNotificationAsRead(notificationId: string) {
    if (!notificationId) throw new Error('Notification ID is required')
    
    const { error } = await zendbx
      .from(TABLES.NOTIFICATIONS)
      .update({ is_read: true })
      .eq('id', notificationId)
    
    if (error) throw error
  }
  
  async markAllNotificationsAsRead(userId: string) {
    if (!userId) throw new Error('User ID is required')
    
    const { error } = await zendbx
      .from(TABLES.NOTIFICATIONS)
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    
    if (error) throw error
  }

  async dismissProfilePrompt(userId: string) {
    localStorage.setItem(`zenhire_prompt_dismissed_${userId}`, new Date().toISOString())
  }
  
  // ============= Settings =============
  
  async getSettings(userId: string) {
    if (!userId) return null
    
    const { data, error } = await zendbx
      .from(TABLES.SETTINGS)
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  }
  
  async updateSettings(userId: string, updates: Partial<Settings>) {
    if (!userId) throw new Error('User ID is required')
    
    const { data, error } = await zendbx
      .from(TABLES.SETTINGS)
      .update(updates)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  }
  
  private async createSettings(userId: string) {
    if (!userId) throw new Error('User ID is required to create settings')
    
    const { data, error } = await zendbx
      .from(TABLES.SETTINGS)
      .insert({
        user_id: userId,
        theme: 'dark',
        demo_mode_enabled: true,
        email_notifications: true,
        push_notifications: true
      })
      .select()
    
    if (error) throw error
    return data && data.length > 0 ? data[0] : null
  }
}

// Export singleton instance and error helper
export { extractErrorMessage }
export const zendbxService = new ZendBXService()
