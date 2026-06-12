import { useAuthStore } from '../store/auth.store'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const fetchMe = useAuthStore((s) => s.fetchMe)

  return {
    user,
    token,
    isAuthenticated: Boolean(token),
    isHydrated,
    isLoading,
    login,
    register,
    logout,
    fetchMe,
  }
}
