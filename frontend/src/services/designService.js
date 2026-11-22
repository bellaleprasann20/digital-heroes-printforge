
import api from './api';

export const designService = {
  async createDesign(payload) {
    return api.post('/api/designs', payload);
  },

  async getMyDesigns({ page = 1, limit = 100 } = {}) {
    return api.get(`/api/designs?page=${page}&limit=${limit}`);
  },

  async getDesign(designId) {
    if (!designId) throw new Error('Design ID is required.');

    return api.get(
      `/api/designs/${encodeURIComponent(designId)}`
    );
  },

  async updateDesign(designId, payload) {
    if (!designId) throw new Error('Design ID is required.');

    return api.patch(
      `/api/designs/${encodeURIComponent(designId)}`,
      payload
    );
  },

  async deleteDesign(designId) {
    if (!designId) throw new Error('Design ID is required.');

    return api.delete(
      `/api/designs/${encodeURIComponent(designId)}`
    );
  },

  async duplicateDesign(designId) {
    if (!designId) throw new Error('Design ID is required.');

    return api.post(
      `/api/designs/${encodeURIComponent(designId)}/duplicate`,
      {}
    );
  },
};

export default designService;
