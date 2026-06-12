import api from './api'

export const sellerService = {
  getDashboard() {
    return api.get('/seller/dashboard')
  },

  getStatistics(params = {}) {
    return api.get('/seller/statistics', { params })
  },

  getOrders(params = {}) {
    return api.get('/seller/orders', { params })
  },
}
