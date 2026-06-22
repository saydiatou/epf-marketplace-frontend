import api from './api';

export const getProducts = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return api.get('/products', { params: cleanParams });
};

export const getProductById = (id) => api.get(`/products/${id}`);

export const getCategories = () => api.get('/categories');

export const searchCatalogue = (q, type = '') => {
  const params = { q };
  if (type) params.type = type;
  return api.get('/search', { params });
};
