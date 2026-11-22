
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { calculateBleed } from './bleedCalculator.js';

const coverPlacement = (sourceWidth, sourceHeight, targetWidth, targetHeight) => {
  const scale = Math.max(
    targetWidth / sourceWidth,
    targetHeight / sourceHeight
  );

  const width = sourceWidth * scale;
  const height = sourceHeight * scale;

  return {
    x: (targetWidth - width) / 2,
    y: (targetHeight - height) / 2,
    width,
    height
  };
};

export const generatePrintPdf = async ({
  artworkBuffer,
  mimeType,
  width,
  height,
  bleed = 3,
  dpi = 300,
  background = null
}) => {
  if (!Buffer.isBuffer(artworkBuffer) || artworkBuffer.length === 0) {
    throw new Error('Artwork buffer is required.');
  }

  const layout = calculateBleed({
    width,
    height,
    bleed,
    dpi
  });

  const pdf = await PDFDocument.create();

  const page = pdf.addPage([
    layout.points.width,
    layout.points.height
  ]);

  if (background) {
    const color = background.replace('#', '');

    if (!/^[0-9a-fA-F]{6}$/.test(color)) {
      throw new Error('Background must be a six-digit hexadecimal color.');
    }

    page.drawRectangle({
      x: 0,
      y: 0,
      width: layout.points.width,
      height: layout.points.height,
      color: {
        red: parseInt(color.slice(0, 2), 16) / 255,
        green: parseInt(color.slice(2, 4), 16) / 255,
        blue: parseInt(color.slice(4, 6), 16) / 255
      }
    });
  }

  let embedded;
  let sourceWidth;
  let sourceHeight;

  if (mimeType === 'application/pdf') {
    const sourcePdf = await PDFDocument.load(artworkBuffer, {
      ignoreEncryption: false
    });

    if (sourcePdf.getPageCount() === 0) {
      throw new Error('Source PDF has no pages.');
    }

    const [embeddedPage] = await pdf.embedPdf(artworkBuffer, [0]);

    embedded = embeddedPage;
    sourceWidth = embeddedPage.width;
    sourceHeight = embeddedPage.height;
  } else {
    let imageBuffer = artworkBuffer;

    if (mimeType === 'image/svg+xml') {
      imageBuffer = await sharp(artworkBuffer, {
        density: dpi,
        limitInputPixels: 150000000
      })
        .png()
        .toBuffer();

      embedded = await pdf.embedPng(imageBuffer);
    } else if (mimeType === 'image/png') {
      embedded = await pdf.embedPng(imageBuffer);
    } else if (
      mimeType === 'image/jpeg' ||
      mimeType === 'image/jpg'
    ) {
      embedded = await pdf.embedJpg(imageBuffer);
    } else if (mimeType === 'image/webp') {
      imageBuffer = await sharp(imageBuffer)
        .png()
        .toBuffer();

      embedded = await pdf.embedPng(imageBuffer);
    } else {
      throw new Error('Unsupported artwork format for PDF generation.');
    }

    sourceWidth = embedded.width;
    sourceHeight = embedded.height;
  }

  const placement = coverPlacement(
    sourceWidth,
    sourceHeight,
    layout.points.width,
    layout.points.height
  );

  page.drawImage(embedded, placement);

  pdf.setTitle('PrintForge Production Artwork');
  pdf.setSubject('Print-ready artwork with bleed');
  pdf.setCreator('Digital Heroes PrintForge');

  const output = await pdf.save({
    useObjectStreams: false
  });

  return {
    buffer: Buffer.from(output),
    mimeType: 'application/pdf',
    fileName: 'print-ready-artwork.pdf',
    layout
  };
};

export default generatePrintPdf;
