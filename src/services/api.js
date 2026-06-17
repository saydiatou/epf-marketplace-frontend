import axios from 'axios'
import toast from 'react-hot-toast'
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
    const message = error.response?.data?.message

    if (status === 401) {
      // Session expirée ou non authentifié : déconnexion auto + toast + redirection
      const wasAuthenticated = Boolean(useAuthStore.getState().token)
      useAuthStore.getState().clearSession()
      if (wasAuthenticated) {
        toast.error('Session expirée, veuillez vous reconnecter')
      }
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.href = ROUTES.LOGIN
      }
    }

    else if (status === 403) {
      if (message?.toLowerCase().includes('suspendu')) {
        useAuthStore.getState().clearSession()
        toast.error('Votre compte a été suspendu')
        if (window.location.pathname !== ROUTES.LOGIN) {
          window.location.href = ROUTES.LOGIN
        }
      } else {
        // Accès refusé à une action/ressource (rôle insuffisant, pas propriétaire, etc.)
        toast.error(message || "Vous n'avez pas les droits pour effectuer cette action")
      }
    }

    else if (status === 422) {
      // Erreurs de validation : on laisse le formulaire afficher le détail,
      // mais on notifie tout de même globalement
      const firstError = error.response?.data?.errors
        ? Object.values(error.response.data.errors)[0]?.[0]
        : null
      toast.error(firstError || message || 'Données invalides')
    }

    else if (status === 429) {
      toast.error('Trop de tentatives, veuillez patienter avant de réessayer')
    }

    else if (status >= 500) {
      toast.error('Erreur serveur, veuillez réessayer plus tard')
    }

    else if (!error.response) {
      // Pas de réponse du serveur (réseau coupé, API down, etc.)
      toast.error('Impossible de contacter le serveur')
    }

    return Promise.reject(error)
  },
)

export default api
