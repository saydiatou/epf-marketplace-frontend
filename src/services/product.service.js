import api from './api'

export const productService = {
  getMyProducts(params = {}) {
    return api.get('/products/my-products', { params })
  },

  create(formData) {
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  update(id, formData) {
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  remove(id) {
    return api.delete(`/products/${id}`)
  },
}
