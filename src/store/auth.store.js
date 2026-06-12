import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/auth.service'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,
      isLoading: false,

      setHydrated() {
        set({ isHydrated: true })
      },

      setSession({ user, token }) {
        set({ user, token })
      },

      clearSession() {
        set({ user: null, token: null })
      },

      async login(credentials) {
        set({ isLoading: true })
        try {
          const { data } = await authService.login(credentials)
          set({ user: data.user, token: data.token, isLoading: false })
          return data
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      async register(payload) {
        set({ isLoading: true })
        try {
          const { data } = await authService.register(payload)
          set({ user: data.user, token: data.token, isLoading: false })
          return data
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      async fetchMe() {
        const token = get().token
        if (!token) return null

        try {
          const { data } = await authService.me()
          set({ user: data.user })
          return data.user
        } catch {
          get().clearSession()
          return null
        }
      },

      async logout() {
        try {
          if (get().token) await authService.logout()
        } finally {
          get().clearSession()
        }
      },
    }),
    {
      name: 'epf-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    },
  ),
)
