import api from './api'

export const authService = {
  register(payload) {
    return api.post('/auth/register', payload)
  },

  login(payload) {
    return api.post('/auth/login', payload)
  },

  logout() {
    return api.post('/auth/logout')
  },

  me() {
    return api.get('/auth/me')
  },

  updateProfile(formData) {
    return api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
