
import multer from 'multer';
import path from 'node:path';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const allowedMimeTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/csv',
  'application/postscript',
  'application/illustrator',
  'application/vnd.adobe.illustrator'
]);

const allowedExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.svg',
  '.pdf',
  '.csv',
  '.ai',
  '.eps'
]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    !allowedExtensions.has(extension) ||
    !allowedMimeTypes.has(file.mimetype)
  ) {
    return callback(
      new Error('Unsupported file type. Please upload an accepted artwork file.')
    );
  }

  callback(null, true);
};

const uploader = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10
  },
  fileFilter
});

export const uploadSingle = (fieldName = 'file') => {
  return uploader.single(fieldName);
};

export const uploadMultiple = (
  fieldName = 'files',
  maxCount = 10
) => {
  return uploader.array(fieldName, maxCount);
};

export const uploadArtwork = uploadSingle('artwork');

export const uploadReference = uploadSingle('reference');

export const uploadVariableData = uploadSingle('file');

export default uploader;
