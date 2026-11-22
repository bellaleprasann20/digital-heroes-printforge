import api from './api';

export const orderService = {
  async createOrder(payload) {
    return api.post('/api/orders', payload);
  },

  async getMyOrders({ page = 1, limit = 10, status } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (status) params.set('status', status);

    return api.get(`/api/orders?${params.toString()}`);
  },

  async getOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required.');
    return api.get(`/api/orders/${encodeURIComponent(orderId)}`);
  },

  async requestReorder(orderId) {
    if (!orderId) throw new Error('Order ID is required.');
    return api.post(
      `/api/orders/${encodeURIComponent(orderId)}/reorder`,
      {}
    );
  },

  async cancelOrder(orderId, reason = '') {
    if (!orderId) throw new Error('Order ID is required.');
    return api.post(
      `/api/orders/${encodeURIComponent(orderId)}/cancel`,
      { reason }
    );
  },

  async getInvoice(orderId) {
    if (!orderId) throw new Error('Order ID is required.');
    return api.get(
      `/api/orders/${encodeURIComponent(orderId)}/invoice`
    );
  },
};

export default orderService;