import api from './api'

export const adminService = {
  getStats() {
    return api.get('/admin/stats')
  },

  getUsers(params = {}) {
    return api.get('/admin/users', { params })
  },

  suspendUser(userId) {
    return api.post(`/admin/users/${userId}/suspend`)
  },

  activateUser(userId) {
    return api.post(`/admin/users/${userId}/activate`)
  },

  updateProductStatus(productId, status) {
    return api.patch(`/admin/products/${productId}/status`, { status })
  },

  forceDeleteProduct(productId) {
    return api.delete(`/admin/products/${productId}/force`)
  },

  getCoupons(params = {}) {
    return api.get('/admin/coupons', { params })
  },

  createCoupon(payload) {
    return api.post('/admin/coupons', payload)
  },

  updateCoupon(couponId, payload) {
    return api.put(`/admin/coupons/${couponId}`, payload)
  },

  deleteCoupon(couponId) {
    return api.delete(`/admin/coupons/${couponId}`)
  },
}
