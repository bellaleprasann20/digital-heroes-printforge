
import path from 'node:path';

const sanitizeFilename = (value, maxLength = 100) => {
  const name = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .replace(/_+/g, '_')
    .replace(/^\.+|[. ]+$/g, '')
    .slice(0, maxLength);

  return name || 'file';
};

const getSafeExtension = (filename) => {
  const extension = path.extname(filename || '').toLowerCase();

  if (!/^\.[a-z0-9]{1,10}$/.test(extension)) {
    throw new Error('Invalid file extension.');
  }

  return extension;
};

export const createProductionFolderName = ({
  orderNumber,
  productType,
  date = new Date()
}) => {
  if (!orderNumber || !productType) {
    throw new Error('Order number and product type are required.');
  }

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('A valid date is required.');
  }

  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');

  return [
    sanitizeFilename(orderNumber),
    sanitizeFilename(productType),
    datePart,
    'Output'
  ].join('_');
};

export const createProductionFilename = ({
  orderNumber,
  productType,
  version = 1,
  extension = '.pdf',
  suffix = ''
}) => {
  if (!orderNumber || !productType) {
    throw new Error('Order number and product type are required.');
  }

  const versionNumber = Number(version);

  if (!Number.isInteger(versionNumber) || versionNumber < 1) {
    throw new Error('Version must be a positive integer.');
  }

  const safeExtension = getSafeExtension(`file${extension}`);

  const parts = [
    sanitizeFilename(orderNumber),
    sanitizeFilename(productType),
    `V${versionNumber}`
  ];

  if (suffix) {
    parts.push(sanitizeFilename(suffix));
  }

  return `${parts.join('_')}${safeExtension}`;
};

export const getSafeStoragePath = ({
  folder,
  filename
}) => {
  if (!folder || !filename) {
    throw new Error('Folder and filename are required.');
  }

  const safeFolder = sanitizeFilename(folder);
  const safeFilename = sanitizeFilename(filename);

  return `${safeFolder}/${safeFilename}`;
};

export { sanitizeFilename };

export default {
  sanitizeFilename,
  createProductionFolderName,
  createProductionFilename,
  getSafeStoragePath
};
