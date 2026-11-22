import api from './api';

export const adminService = {
  // Dashboard and reports
  getDashboard: () => api.get('/api/admin/dashboard'),

  getAnalytics: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/analytics?${query.toString()}`);
  },

  exportReport: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/reports/export?${query.toString()}`);
  },

  // Customer management
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/customers?${query.toString()}`);
  },

  updateCustomerStatus: (userId, status) =>
    api.patch(`/api/admin/customers/${encodeURIComponent(userId)}/status`, {
      status,
    }),

  // Product management
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/products?${query.toString()}`);
  },

  createProduct: (payload) => api.post('/api/admin/products', payload),

  updateProduct: (productId, payload) =>
    api.patch(
      `/api/admin/products/${encodeURIComponent(productId)}`,
      payload
    ),

  deleteProduct: (productId) =>
    api.delete(`/api/admin/products/${encodeURIComponent(productId)}`),

  // Category management
  getCategories: () => api.get('/api/admin/categories'),

  createCategory: (payload) =>
    api.post('/api/admin/categories', payload),

  updateCategory: (categoryId, payload) =>
    api.patch(
      `/api/admin/categories/${encodeURIComponent(categoryId)}`,
      payload
    ),

  deleteCategory: (categoryId) =>
    api.delete(`/api/admin/categories/${encodeURIComponent(categoryId)}`),

  // Order and production management
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/orders?${query.toString()}`);
  },

  updateOrderStatus: (orderId, status, note = '') =>
    api.patch(
      `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
      { status, note }
    ),

  getProductionQueue: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/production?${query.toString()}`);
  },

  updateProductionStage: (jobId, stage, note = '') =>
    api.patch(
      `/api/admin/production/${encodeURIComponent(jobId)}/stage`,
      { stage, note }
    ),

  getProductionJob: (jobId) =>
    api.get(`/api/admin/production/${encodeURIComponent(jobId)}`),

  // Proof management
  getProofs: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/proofs?${query.toString()}`);
  },

  createProofVersion: (proofId, payload) =>
    api.post(
      `/api/admin/proofs/${encodeURIComponent(proofId)}/versions`,
      payload
    ),

  // Templates and settings
  getTemplates: () => api.get('/api/admin/templates'),

  createTemplate: (payload) =>
    api.post('/api/admin/templates', payload),

  updateTemplate: (templateId, payload) =>
    api.patch(
      `/api/admin/templates/${encodeURIComponent(templateId)}`,
      payload
    ),

  getSettings: () => api.get('/api/admin/settings'),

  updateSettings: (payload) =>
    api.patch('/api/admin/settings', payload),
};

export default adminService;