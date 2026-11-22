import api from './api';

export const paymentService = {
  async createPaymentOrder(orderId) {
    if (!orderId) throw new Error('Order ID is required.');

    return api.post('/api/payments/create-order', { orderId });
  },

  async verifyPayment(payload) {
    const requiredFields = [
      'razorpay_order_id',
      'razorpay_payment_id',
      'razorpay_signature',
    ];

    for (const field of requiredFields) {
      if (!payload?.[field]) {
        throw new Error(`${field} is required.`);
      }
    }

    return api.post('/api/payments/verify', payload);
  },

  async getPaymentStatus(orderId) {
    if (!orderId) throw new Error('Order ID is required.');

    return api.get(
      `/api/payments/status/${encodeURIComponent(orderId)}`
    );
  },

  async requestRefund(paymentId, reason = '') {
    if (!paymentId) throw new Error('Payment ID is required.');

    return api.post('/api/payments/refund', {
      paymentId,
      reason,
    });
  },
};

export default paymentService;