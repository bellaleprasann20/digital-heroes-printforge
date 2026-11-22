import api from './api';

export const adminService = {
  // Dashboard and reports
  getDashboard: () => api.get('/api/analytics/dashboard'),

  getAnalytics: (params = {}) => {
    const query = new URLSearchParams();

    if (params.from) query.set('startDate', params.from);
    if (params.to) query.set('endDate', params.to);

    const queryString = query.toString();

    return api.get(
      `/api/analytics/revenue${queryString ? `?${queryString}` : ''}`
    );
  },

  exportReport: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/admin/reports/export?${query.toString()}`);
  },

    // Customer management
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/users/customers?${query.toString()}`);
  },

  updateCustomerRole: (userId, role) =>
    api.patch(
      `/api/users/customers/${encodeURIComponent(userId)}/role`,
      { role }
    ),

  // Product management
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/products/admin?${query.toString()}`);
  },

  createProduct: (payload) => api.post('/api/products', payload),

  updateProduct: (productId, payload) =>
    api.patch(
      `/api/products/${encodeURIComponent(productId)}`,
      payload
    ),

  deleteProduct: (productId) =>
    api.delete(`/api/products/${encodeURIComponent(productId)}`),

  // Category management
  getCategories: () => api.get('/api/categories/admin'),

  createCategory: (payload) =>
    api.post('/api/categories', payload),

  updateCategory: (categoryId, payload) =>
    api.patch(
      `/api/categories/${encodeURIComponent(categoryId)}`,
      payload
    ),

  deleteCategory: (categoryId) =>
    api.delete(`/api/categories/${encodeURIComponent(categoryId)}`),

  // Order and production management
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params);
    return api.get(`/api/orders/admin?${query.toString()}`);
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





