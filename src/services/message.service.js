import api from './api'

export const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/with/${userId}`),
  sendMessage: (recipient_id, content, product_id = null) =>
    api.post('/messages', { recipient_id, content, ...(product_id ? { product_id } : {}) }),
  getUnreadCount: () => api.get('/messages/unread-count'),
}
