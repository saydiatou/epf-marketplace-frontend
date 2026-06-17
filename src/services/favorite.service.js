import api from './api'

export const favoriteService = {
  getFavorites: (sort = '') => api.get('/favorites', { params: sort ? { sort } : {} }),
  addFavorite: (product_id) => api.post('/favorites/add', { product_id }),
  removeFavorite: (product_id) => api.delete(`/favorites/${product_id}`),
  isFavorite: (product_id) => api.get(`/products/${product_id}/is-favorite`),
}
