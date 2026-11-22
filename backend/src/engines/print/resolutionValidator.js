
import sharp from 'sharp';

const MM_PER_INCH = 25.4;

export const validateResolution = async ({
  buffer,
  width,
  height,
  minDpi = 300,
  allowUpscaling = false
}) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('A valid artwork buffer is required.');
  }

  const printWidth = Number(width);
  const printHeight = Number(height);
  const requiredDpi = Number(minDpi);

  if (
    !Number.isFinite(printWidth) ||
    !Number.isFinite(printHeight) ||
    printWidth <= 0 ||
    printHeight <= 0
  ) {
    throw new Error('Print dimensions must be positive millimetre values.');
  }

  if (!Number.isFinite(requiredDpi) || requiredDpi <= 0) {
    throw new Error('Minimum DPI must be a positive number.');
  }

  const metadata = await sharp(buffer, {
    failOn: 'error',
    limitInputPixels: 150000000
  }).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read artwork pixel dimensions.');
  }

  if (!['png', 'jpeg', 'webp', 'tiff'].includes(metadata.format)) {
    throw new Error(
      'Resolution validation supports raster artwork only. PDF and SVG require separate inspection.'
    );
  }

  const effectiveDpiX =
    metadata.width / (printWidth / MM_PER_INCH);

  const effectiveDpiY =
    metadata.height / (printHeight / MM_PER_INCH);

  const effectiveDpi = Math.min(effectiveDpiX, effectiveDpiY);

  const meetsRequirement = effectiveDpi >= requiredDpi;

  return {
    valid: meetsRequirement || allowUpscaling,
    format: metadata.format,
    pixels: {
      width: metadata.width,
      height: metadata.height
    },
    printSize: {
      width: printWidth,
      height: printHeight,
      unit: 'mm'
    },
    effectiveDpi: Math.floor(effectiveDpi),
    effectiveDpiX: Math.floor(effectiveDpiX),
    effectiveDpiY: Math.floor(effectiveDpiY),
    requiredDpi,
    meetsRequirement,
    upscalingAllowed: allowUpscaling,
    warnings: meetsRequirement
      ? []
      : [
          `Artwork resolution is approximately ${Math.floor(effectiveDpi)} DPI. Recommended minimum is ${requiredDpi} DPI.`
        ]
  };
};

export default validateResolution;
