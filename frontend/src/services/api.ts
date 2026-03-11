import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it and redirect to login
      localStorage.removeItem('token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: (params?: { category?: string; search?: string }) => 
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (product: any) => api.post('/products', product),
  createBulk: (products: any[]) => api.post('/products/bulk', products),
  update: (id: string, product: any) => api.put(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateStock: (id: string, data: { quantity: number; operation: string }) => 
    api.patch(`/products/${id}/stock`, data),
  getLowStock: () => api.get('/products/low-stock'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (category: any) => api.post('/categories', category),
  update: (id: string, category: any) => api.put(`/categories/${id}`, category),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  getById: (id: string) => api.get(`/transactions/${id}`),
  create: (transaction: any) => api.post('/transactions', transaction),
  getStats: () => api.get('/transactions/stats'),
};

export default api;
