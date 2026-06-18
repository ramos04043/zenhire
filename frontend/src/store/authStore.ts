import { create } from 'zustand'
import { zendbxService } from '../services/ZendBXService'
import { zendbx } from '../lib/zendbx'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  full_name?: string
  role: string
  is_profile_complete: boolean
  login_count?: number
  profile_completion_rate?: number
  last_prompt_dismissed_at?: string
  created_at?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  initAuth: () => Promise<void>
  updateProfileCompletion: (isComplete: boolean) => void
}

const buildUser = (u: any, profile: any, extendedData: any, cachedStatus = false) => ({
  id: u.id,
  email: u.email!,
  full_name: u.user_metadata?.full_name,
  role: u.user_metadata?.role || 'candidate',
  is_profile_complete: extendedData?.is_profile_complete
    || !!(profile?.phone && profile?.location && profile?.title)
    || cachedStatus,
  login_count: extendedData?.login_count || 0,
  profile_completion_rate: extendedData?.profile_completion_rate || 0,
  last_prompt_dismissed_at: extendedData?.last_prompt_dismissed_at,
  created_at: extendedData?.created_at || u.created_at,
})

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    try {
      const { user } = await zendbxService.signIn(email, password)
      if (user) {
        localStorage.setItem('zenhire_authenticated', 'true')
        const [profile, extendedData] = await Promise.all([
          zendbxService.getCurrentUserProfile(),
          zendbxService.getUserExtendedData(user.id),
        ])
        const isComplete = !!((profile?.phone as string)?.trim() && (profile?.location as string)?.trim() && (profile?.title as string)?.trim())
        if (isComplete) localStorage.setItem(`profile_complete_${user.id}`, 'true')
        set({ user: buildUser(user, profile, extendedData), isAuthenticated: true })
        toast.success('Welcome back!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      throw error
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    try {
      const { user } = await zendbxService.signUp(email, password, fullName)
      if (user) {
        localStorage.setItem('zenhire_authenticated', 'true')
        set({
          user: { id: user.id, email: user.email!, full_name: fullName, role: 'candidate', is_profile_complete: false },
          isAuthenticated: true,
        })
        toast.success('Account created successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed')
      throw error
    }
  },

  logout: async () => {
    try {
      await zendbxService.signOut()
      localStorage.removeItem('zenhire_authenticated')
      set({ user: null, isAuthenticated: false })
      toast.success('Logged out successfully')
    } catch (error: any) {
      toast.error('Logout failed')
    }
  },

  initAuth: async () => {
    try {
      zendbx.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('zenhire_authenticated')
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }
        if (session?.user) {
          localStorage.setItem('zenhire_authenticated', 'true')
          const cachedStatus = localStorage.getItem(`profile_complete_${session.user.id}`) === 'true'
          const [profile, extendedData] = await Promise.all([
            zendbxService.getCurrentUserProfile(),
            zendbxService.getUserExtendedData(session.user.id),
          ])
          const isComplete = !!((profile?.phone as string)?.trim() && (profile?.location as string)?.trim() && (profile?.title as string)?.trim())
          if (isComplete) localStorage.setItem(`profile_complete_${session.user.id}`, 'true')
          set({ user: buildUser(session.user, profile, extendedData, cachedStatus), isAuthenticated: true, isLoading: false })
        }
      })

      const result = await zendbx.auth.getSession()
      const session = result?.data?.session
      const error = (result as any)?.error
      const isActuallyAuthenticated = localStorage.getItem('zenhire_authenticated') === 'true'

      if (error && !isActuallyAuthenticated) {
        set({ user: null, isAuthenticated: false, isLoading: false })
        return
      }

      if (session?.user) {
        localStorage.setItem('zenhire_authenticated', 'true')
        const cachedStatus = localStorage.getItem(`profile_complete_${session.user.id}`) === 'true'
        const [profile2, extendedData2] = await Promise.all([
          zendbxService.getCurrentUserProfile(),
          zendbxService.getUserExtendedData(session.user.id),
        ])
        const isComplete2 = !!((profile2?.phone as string)?.trim() && (profile2?.location as string)?.trim() && (profile2?.title as string)?.trim())
        if (isComplete2) localStorage.setItem(`profile_complete_${session.user.id}`, 'true')
        set({ user: buildUser(session.user, profile2, extendedData2, cachedStatus), isAuthenticated: true, isLoading: false })
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  updateProfileCompletion: (isComplete: boolean) => {
    const userId = useAuthStore.getState().user?.id
    if (userId && isComplete) localStorage.setItem(`profile_complete_${userId}`, 'true')
    set((state) => ({
      user: state.user ? { ...state.user, is_profile_complete: isComplete } : null,
    }))
  },
}))
