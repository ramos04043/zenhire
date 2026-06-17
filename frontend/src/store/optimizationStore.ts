import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { OptimizationResult, ResumeVersionSummary } from '../services/resumeOptimizationService'

interface OptimizationState {
  // Current optimization in progress / just completed
  isOptimizing: boolean
  currentResult: OptimizationResult | null
  currentJob: { title: string; company: string; description: string; id?: string } | null

  // Version history (loaded from backend, cached locally)
  versions: ResumeVersionSummary[]
  versionsLoaded: boolean

  // Actions
  setIsOptimizing: (v: boolean) => void
  setResult: (result: OptimizationResult, job: { title: string; company: string; description: string; id?: string }) => void
  clearResult: () => void
  setVersions: (versions: ResumeVersionSummary[]) => void
  addVersion: (v: ResumeVersionSummary) => void
  removeVersion: (id: number) => void
}

export const useOptimizationStore = create<OptimizationState>()(
  persist(
    (set) => ({
      isOptimizing: false,
      currentResult: null,
      currentJob: null,
      versions: [],
      versionsLoaded: false,

      setIsOptimizing: (v) => set({ isOptimizing: v }),

      setResult: (result, job) => set({ currentResult: result, currentJob: job }),

      clearResult: () => set({ currentResult: null, currentJob: null }),

      setVersions: (versions) => set({ versions, versionsLoaded: true }),

      addVersion: (v) => set(s => ({ versions: [v, ...s.versions] })),

      removeVersion: (id) => set(s => ({ versions: s.versions.filter(v => v.id !== id) })),
    }),
    {
      name: 'zenhire-optimization',
      partialize: (s) => ({ versions: s.versions }),
    }
  )
)
