
import sharp from 'sharp';
import { calculateBleed } from './bleedCalculator.js';

export const generatePrintPng = async ({
  artworkBuffer,
  mimeType,
  width,
  height,
  bleed = 3,
  dpi = 300,
  background = { r: 255, g: 255, b: 255, alpha: 0 }
}) => {
  if (!Buffer.isBuffer(artworkBuffer) || artworkBuffer.length === 0) {
    throw new Error('Artwork buffer is required.');
  }

  if (
    !['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(
      mimeType
    )
  ) {
    throw new Error(
      'PNG generation accepts PNG, JPEG, WebP and SVG artwork.'
    );
  }

  const layout = calculateBleed({
    width,
    height,
    bleed,
    dpi
  });

  const outputWidth = layout.pixels.width;
  const outputHeight = layout.pixels.height;

  const backgroundColor = background;

  let pipeline = sharp(artworkBuffer, {
    density: dpi,
    failOn: 'error',
    limitInputPixels: 150000000
  });

  pipeline = pipeline
    .resize(outputWidth, outputHeight, {
      fit: 'cover',
      position: 'centre',
      withoutEnlargement: false
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true
    });

  const buffer = await pipeline.toBuffer();

  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    mimeType: 'image/png',
    fileName: 'print-ready-artwork.png',
    dimensions: {
      width: outputWidth,
      height: outputHeight,
      unit: 'pixels'
    },
    physicalSize: layout.document,
    dpi,
    bleed,
    background: backgroundColor,
    metadata: {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height
    },
    layout
  };
};

export default generatePrintPng;
