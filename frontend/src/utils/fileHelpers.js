export const ARTWORK_EXTENSIONS = [
  'pdf',
  'svg',
  'ai',
  'png',
  'jpg',
  'jpeg',
  'webp',
];

export const IMAGE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'webp',
];

export const MAX_ARTWORK_SIZE = 25 * 1024 * 1024;
export const MAX_REFERENCE_SIZE = 5 * 1024 * 1024;
export const MAX_CSV_SIZE = 25 * 1024 * 1024;

export function getFileExtension(filename = '') {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

export function formatFileSize(bytes) {
  const size = Number(bytes);

  if (!Number.isFinite(size) || size < 0) return '—';
  if (size === 0) return '0 Bytes';

  const units = ['Bytes', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(size) / Math.log(1024)),
    units.length - 1
  );

  const formatted = size / Math.pow(1024, index);

  return `${formatted.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export function validateArtworkFile(file) {
  if (!(file instanceof File)) {
    return { valid: false, error: 'Please select a valid file.' };
  }

  const extension = getFileExtension(file.name);

  if (!ARTWORK_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported artwork format. Allowed: ${ARTWORK_EXTENSIONS.join(', ')}.`,
    };
  }

  if (file.size <= 0 || file.size > MAX_ARTWORK_SIZE) {
    return {
      valid: false,
      error: 'Artwork must be greater than 0 and no larger than 25 MB.',
    };
  }

  return { valid: true, error: null };
}

export function validateImageFile(file) {
  if (!(file instanceof File)) {
    return { valid: false, error: 'Please select a valid image.' };
  }

  const extension = getFileExtension(file.name);

  if (!IMAGE_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Only PNG, JPG, JPEG and WebP images are supported.',
    };
  }

  if (file.size <= 0 || file.size > MAX_REFERENCE_SIZE) {
    return {
      valid: false,
      error: 'Image must be greater than 0 and no larger than 5 MB.',
    };
  }

  return { valid: true, error: null };
}

export function validateCsvFile(file) {
  if (!(file instanceof File)) {
    return { valid: false, error: 'Please select a valid CSV file.' };
  }

  if (getFileExtension(file.name) !== 'csv') {
    return { valid: false, error: 'Only CSV files are supported.' };
  }

  if (file.size <= 0 || file.size > MAX_CSV_SIZE) {
    return {
      valid: false,
      error: 'CSV must be greater than 0 and no larger than 25 MB.',
    };
  }

  return { valid: true, error: null };
}

export function createObjectUrl(file) {
  if (!(file instanceof Blob)) {
    throw new Error('A valid file is required.');
  }

  return URL.createObjectURL(file);
}

export function revokeObjectUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function downloadBlob(blob, filename = 'download') {
  if (!(blob instanceof Blob)) {
    throw new Error('A valid downloadable file is required.');
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function sanitizeFilename(filename = 'file') {
  return filename
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 150) || 'file';
}

export function getFileAcceptAttribute(extensions = ARTWORK_EXTENSIONS) {
  return extensions.map((extension) => `.${extension}`).join(',');
}

export default {
  getFileExtension,
  formatFileSize,
  validateArtworkFile,
  validateImageFile,
  validateCsvFile,
  createObjectUrl,
  revokeObjectUrl,
  downloadBlob,
  sanitizeFilename,
  getFileAcceptAttribute,
};