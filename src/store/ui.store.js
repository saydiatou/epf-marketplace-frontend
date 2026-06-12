import { create } from 'zustand'

export const useUiStore = create((set) => ({
  sidebarOpen: true,
  globalLoading: false,

  toggleSidebar() {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setSidebarOpen(sidebarOpen) {
    set({ sidebarOpen })
  },

  setGlobalLoading(globalLoading) {
    set({ globalLoading })
  },
}))
