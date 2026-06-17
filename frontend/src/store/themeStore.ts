import { create } from 'zustand'

interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  initTheme: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',

  toggleTheme: () => {
    const newTheme = get().theme === 'dark' ? 'light' : 'dark'
    set({ theme: newTheme })
    localStorage.setItem('zenhire_theme', newTheme)
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme })
    localStorage.setItem('zenhire_theme', theme)
  },

  initTheme: () => {
    const savedTheme = localStorage.getItem('zenhire_theme') as 'light' | 'dark' | null
    if (savedTheme) {
      set({ theme: savedTheme })
    }
  },
}))
