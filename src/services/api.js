import axios from 'axios'
import { ROUTES } from '../constants/routes'
import { useAuthStore } from '../store/auth.store'

const baseURL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      useAuthStore.getState().clearSession()
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN
      }
    }

    if (status === 403) {
      const message = error.response?.data?.message
      if (message?.toLowerCase().includes('suspendu')) {
        useAuthStore.getState().clearSession()
      }
    }

    return Promise.reject(error)
  },
)

export default api
