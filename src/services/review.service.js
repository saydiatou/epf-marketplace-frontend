import api from './api'

export const reviewService = {
  getReviews: (productId, sort = '') => api.get(`/products/${productId}/reviews`, { params: sort ? { sort } : {} }),
  createReview: (productId, rating, comment) => api.post(`/products/${productId}/reviews`, { rating, comment }),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
}
