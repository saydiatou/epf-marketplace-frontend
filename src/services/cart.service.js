import api from './api'

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (product_id, quantity = 1) => api.post('/cart/add', { product_id, quantity }),
  updateItem: (cartItemId, quantity) => api.put(`/cart/items/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clearCart: () => api.delete('/cart/clear'),
}
