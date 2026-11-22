import api from './api';

export const pricingService = {
  async calculateQuote(configuration) {
    return api.post('/api/pricing/quote', configuration);
  },

  async validateQuote(quoteId) {
    if (!quoteId) throw new Error('Quote ID is required.');
    return api.post('/api/pricing/validate', { quoteId });
  },

  async getPricingRules(productId) {
    if (!productId) throw new Error('Product ID is required.');
    return api.get(`/api/pricing/rules/${encodeURIComponent(productId)}`);
  },
};

export default pricingService;