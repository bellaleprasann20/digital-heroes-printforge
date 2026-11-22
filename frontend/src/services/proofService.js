
import api from './api';

export const proofService = {
  async getMyProofs({ page = 1, limit = 100 } = {}) {
    return api.get(`/api/proofs?page=${page}&limit=${limit}`);
  },

  async approveProof(proofId) {
    if (!proofId) throw new Error('Proof ID is required.');

    return api.post(
      `/api/proofs/${encodeURIComponent(proofId)}/approve`,
      {}
    );
  },

  async requestChanges(proofId, message) {
    if (!proofId) throw new Error('Proof ID is required.');

    if (!message || message.trim().length < 5) {
      throw new Error('Please provide at least 5 characters explaining the changes.');
    }

    return api.post(
      `/api/proofs/${encodeURIComponent(proofId)}/request-changes`,
      { message: message.trim() }
    );
  },

  async getVersions(orderId) {
    if (!orderId) throw new Error('Order ID is required.');

    return api.get(
      `/api/proofs/versions/${encodeURIComponent(orderId)}`
    );
  },
};

export default proofService;
