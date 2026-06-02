// Ce fichier a été modifié pour centraliser la gestion des erreurs réseau et d'authentification.
// Changements : ajout des toasts pour notifications, gestion 401/403/global network.

import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Attach Authorization header when token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Network or CORS errors (no response)
    if (!error.response) {
      toast.error("Erreur réseau — impossible de contacter le serveur.");
      return Promise.reject(error);
    }

    // Extract message from API if available
    const apiMessage = error.response.data?.message || error.response.data?.error;

    if (status === 401) {
      // Unauthorized — clear local auth and force login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.error(apiMessage || 'Session expirée — veuillez vous reconnecter.');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    if (status === 403) {
      // Forbidden — keep user on page but show message
      toast.error(apiMessage || "Accès refusé — vous n'avez pas la permission.");
      return Promise.reject(error);
    }

    // Other client/server errors — surface message when available
    if (status >= 400 && status < 600) {
      toast.error(apiMessage || 'Une erreur est survenue.');
    }

    return Promise.reject(error);
  }
);

export default api;
