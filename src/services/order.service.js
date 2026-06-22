import api from './api'

export const orderService = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: (params = {}) => api.get('/orders/my-orders', { params }),
  getOrderDetail: (orderId) => api.get(`/orders/${orderId}`),
  cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
}
