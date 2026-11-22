import api from './api';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_ARTWORK_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/webp',
  'application/postscript',
]);

const ALLOWED_REFERENCE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
]);

function validateFile(file, allowedTypes) {
  if (!(file instanceof File)) {
    throw new Error('Please select a valid file.');
  }

  if (!allowedTypes.has(file.type)) {
    throw new Error('This file type is not supported.');
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be greater than 0 and no more than 25 MB.');
  }
}

export const uploadService = {
  async uploadArtwork(file, metadata = {}) {
    validateFile(file, ALLOWED_ARTWORK_TYPES);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return api.post('/api/uploads/artwork', formData);
  },

  async uploadReference(file, metadata = {}) {
    validateFile(file, ALLOWED_REFERENCE_TYPES);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return api.post('/api/uploads/reference', formData);
  },

  async uploadVariableData(file, metadata = {}) {
    if (!(file instanceof File)) {
      throw new Error('Please select a CSV file.');
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      throw new Error('Variable data upload must be a CSV file.');
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      throw new Error('CSV size must be greater than 0 and no more than 25 MB.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return api.post('/api/uploads/variable-data', formData);
  },

  async deleteUpload(fileId) {
    if (!fileId) throw new Error('File ID is required.');

    return api.delete(`/api/uploads/${encodeURIComponent(fileId)}`);
  },
};

export default uploadService;