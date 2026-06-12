import api from './api'

export const orderService = {
  updateStatus(orderId, status) {
    return api.put(`/orders/${orderId}/status`, { status })
  },
}
