
import path from 'node:path';
import { fileTypeFromBuffer } from 'file-type';

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg']
};

const getExtension = (filename) =>
  path.extname(filename || '').toLowerCase();

const validateSvg = (buffer) => {
  const content = buffer.toString('utf8');

  if (!/<svg[\s>]/i.test(content)) {
    throw new Error('Invalid SVG document.');
  }

  const dangerousPatterns = [
    /<script[\s>]/i,
    /javascript\s*:/i,
    /on\w+\s*=/i,
    /<foreignObject[\s>]/i,
    /<!ENTITY/i,
    /<iframe[\s>]/i
  ];

  if (dangerousPatterns.some((pattern) => pattern.test(content))) {
    throw new Error('SVG contains unsupported or unsafe content.');
  }

  return content;
};

const parseSvgDimensions = (content) => {
  const svgTag = content.match(/<svg\b[^>]*>/i)?.[0];

  if (!svgTag) return null;

  const width = svgTag.match(/\bwidth=["']([\d.]+)(px)?["']/i);
  const height = svgTag.match(/\bheight=["']([\d.]+)(px)?["']/i);
  const viewBox = svgTag.match(
    /\bviewBox=["']\s*([\d.\s,-]+)\s*["']/i
  );

  let parsedWidth = width ? Number(width[1]) : null;
  let parsedHeight = height ? Number(height[1]) : null;

  if ((!parsedWidth || !parsedHeight) && viewBox) {
    const values = viewBox[1].trim().split(/[\s,]+/).map(Number);

    if (values.length === 4) {
      parsedWidth ||= values[2];
      parsedHeight ||= values[3];
    }
  }

  return parsedWidth > 0 && parsedHeight > 0
    ? { width: parsedWidth, height: parsedHeight }
    : null;
};

export const parseArtwork = async (file) => {
  if (!file?.buffer || !Buffer.isBuffer(file.buffer)) {
    throw new Error('A valid uploaded file is required.');
  }

  if (!file.originalname) {
    throw new Error('Original filename is required.');
  }

  if (file.buffer.length === 0) {
    throw new Error('Uploaded file is empty.');
  }

  if (file.buffer.length > MAX_FILE_SIZE) {
    throw new Error('Artwork exceeds the 50 MB file limit.');
  }

  const extension = getExtension(file.originalname);

  if (extension === '.ai' || extension === '.eps') {
    throw new Error(
      'AI and EPS files must be converted to PDF before artwork inspection.'
    );
  }

  const isSvg = extension === '.svg';

  let detectedMimeType;
  let dimensions = null;

  if (isSvg) {
    const svgContent = validateSvg(file.buffer);
    detectedMimeType = 'image/svg+xml';
    dimensions = parseSvgDimensions(svgContent);
  } else {
    const detected = await fileTypeFromBuffer(file.buffer);

    if (!detected) {
      throw new Error('Unable to identify the uploaded file format.');
    }

    detectedMimeType = detected.mime;

    if (detectedMimeType === 'image/png') {
      const buffer = file.buffer;

      if (buffer.length >= 24) {
        dimensions = {
          width: buffer.readUInt32BE(16),
          height: buffer.readUInt32BE(20)
        };
      }
    } else if (detectedMimeType === 'image/jpeg') {
      dimensions = null;
    } else if (detectedMimeType === 'image/webp') {
      dimensions = null;
    } else if (detectedMimeType === 'application/pdf') {
      dimensions = null;
    }
  }

  const allowedExtensions = ALLOWED_TYPES[detectedMimeType];

  if (!allowedExtensions || !allowedExtensions.includes(extension)) {
    throw new Error(
      'File content does not match a supported artwork format.'
    );
  }

  if (file.mimetype && file.mimetype !== detectedMimeType) {
    throw new Error('Uploaded MIME type does not match file content.');
  }

  return {
    originalName: path.basename(file.originalname),
    extension,
    mimeType: detectedMimeType,
    size: file.buffer.length,
    dimensions,
    isVector: ['application/pdf', 'image/svg+xml'].includes(
      detectedMimeType
    ),
    isRaster: ['image/png', 'image/jpeg', 'image/webp'].includes(
      detectedMimeType
    ),
    status: 'validated'
  };
};

export default parseArtwork;
