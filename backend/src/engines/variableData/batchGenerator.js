
import fs from 'node:fs/promises';
import path from 'node:path';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { fitText } from './textFitter.js';

const MM_TO_POINTS = 72 / 25.4;
const MAX_BATCH_SIZE = 10000;

const mmToPoints = (value) => Number(value) * MM_TO_POINTS;

const safeFilename = (value) =>
  String(value || 'item')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'item';

const parseColor = (value = '#000000') => {
  const hex = String(value).replace('#', '');

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    throw new Error(`Invalid placeholder color: ${value}`);
  }

  return rgb(
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  );
};

const validatePlaceholder = (placeholder) => {
  const required = [
    'field',
    'x',
    'y',
    'width',
    'fontPath'
  ];

  for (const key of required) {
    if (placeholder[key] === undefined || placeholder[key] === null) {
      throw new Error(`Placeholder is missing "${key}".`);
    }
  }

  for (const key of ['x', 'y', 'width']) {
    if (!Number.isFinite(Number(placeholder[key]))) {
      throw new Error(`Placeholder "${key}" must be numeric.`);
    }
  }

  if (
    Number(placeholder.x) < 0 ||
    Number(placeholder.y) < 0 ||
    Number(placeholder.width) <= 0
  ) {
    throw new Error('Placeholder coordinates and width are invalid.');
  }
};

export const generateVariableDataBatch = async ({
  templatePdfPath,
  rows,
  placeholders,
  outputRoot,
  orderId,
  productType
}) => {
  if (!templatePdfPath || !outputRoot || !orderId || !productType) {
    throw new Error('Template, output directory, order ID and product type are required.');
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('At least one validated CSV row is required.');
  }

  if (rows.length > MAX_BATCH_SIZE) {
    throw new Error(`Batch cannot exceed ${MAX_BATCH_SIZE} records.`);
  }

  if (!Array.isArray(placeholders) || placeholders.length === 0) {
    throw new Error('At least one text placeholder is required.');
  }

  placeholders.forEach(validatePlaceholder);

  const templateBuffer = await fs.readFile(templatePdfPath);

  const template = await PDFDocument.load(templateBuffer);
  const templatePages = template.getPages();

  if (templatePages.length === 0) {
    throw new Error('The PDF template contains no pages.');
  }

  const sourcePage = templatePages[0];
  const pageWidth = sourcePage.getWidth();
  const pageHeight = sourcePage.getHeight();

  const fontBuffers = new Map();

  for (const placeholder of placeholders) {
    const fontPath = path.resolve(placeholder.fontPath);

    if (!fontBuffers.has(fontPath)) {
      fontBuffers.set(fontPath, await fs.readFile(fontPath));
    }

    const x = mmToPoints(placeholder.x);
    const y = mmToPoints(placeholder.y);
    const width = mmToPoints(placeholder.width);

    if (
      x + width > pageWidth ||
      y > pageHeight
    ) {
      throw new Error(
        `Placeholder "${placeholder.field}" exceeds template page boundaries.`
      );
    }
  }

  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');

  const folderName = [
    safeFilename(orderId),
    safeFilename(productType),
    datePart,
    'Output'
  ].join('_');

  const outputDirectory = path.resolve(outputRoot, folderName);

  await fs.mkdir(outputDirectory, { recursive: true });

  const results = [];
  const errors = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const rowData = row.data || {};
    const rowNumber = row.rowNumber ?? index + 1;

    try {
      const pdf = await PDFDocument.create();

      pdf.registerFontkit(fontkit);

      const [copiedPage] = await pdf.copyPages(template, [0]);
      pdf.addPage(copiedPage);

      const page = pdf.getPages()[0];

      for (const placeholder of placeholders) {
        const value = rowData[placeholder.field];

        if (value === undefined || value === null || String(value) === '') {
          throw new Error(
            `Missing value for placeholder "${placeholder.field}".`
          );
        }

        const fontPath = path.resolve(placeholder.fontPath);
        const fontBuffer = fontBuffers.get(fontPath);

        const font = await pdf.embedFont(fontBuffer, {
          subset: true
        });

        const text = String(value);

        const fitted = fitText({
          text,
          fontPath,
          maxWidth: mmToPoints(placeholder.width),
          maxFontSize: Number(placeholder.fontSize || 36),
          minFontSize: Number(placeholder.minFontSize || 8),
          tracking: Number(placeholder.tracking || 0),
          shrinkToFit: placeholder.shrinkToFit !== false
        });

        if (!fitted.fitted) {
          throw new Error(
            `Text for "${placeholder.field}" cannot fit in its placeholder.`
          );
        }

        const fontSize = fitted.fontSize;
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        const boxWidth = mmToPoints(placeholder.width);
        const x = mmToPoints(placeholder.x);
        const top = mmToPoints(placeholder.y);

        const alignment = placeholder.align || 'left';

        let drawX = x;

        if (alignment === 'center') {
          drawX = x + (boxWidth - textWidth) / 2;
        } else if (alignment === 'right') {
          drawX = x + boxWidth - textWidth;
        } else if (alignment !== 'left') {
          throw new Error(`Unsupported alignment: ${alignment}`);
        }

        if (drawX < x - 0.1 || drawX + textWidth > x + boxWidth + 0.1) {
          throw new Error(
            `Text for "${placeholder.field}" exceeds its placeholder width.`
          );
        }

        const baselineY = pageHeight - top - fontSize;

        page.drawText(text, {
          x: drawX,
          y: baselineY,
          size: fontSize,
          font,
          color: parseColor(placeholder.color),
          characterSpacing: Number(placeholder.tracking || 0)
        });
      }

      const pdfBytes = await pdf.save();

      const identifier = safeFilename(
        rowData.id || rowData.ID || `row_${rowNumber}`
      );

      const filename = `${String(rowNumber).padStart(5, '0')}_${identifier}.pdf`;
      const filePath = path.join(outputDirectory, filename);

      await fs.writeFile(filePath, Buffer.from(pdfBytes), {
        flag: 'wx'
      });

      results.push({
        rowNumber,
        filename,
        filePath,
        size: pdfBytes.length,
        status: 'generated'
      });
    } catch (error) {
      errors.push({
        rowNumber,
        message: error.message
      });
    }
  }

  return {
    outputDirectory,
    totalRecords: rows.length,
    generatedCount: results.length,
    failedCount: errors.length,
    files: results,
    errors,
    status:
      errors.length === 0
        ? 'completed'
        : results.length > 0
          ? 'completed_with_errors'
          : 'failed'
  };
};

export default generateVariableDataBatch;
