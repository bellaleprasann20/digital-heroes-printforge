
import path from 'node:path';

import supabase from '../config/supabase.js';
import { env } from '../config/env.js';

import { parseArtwork } from '../engines/designer/artworkParser.js';
import { validatePrintArea } from '../engines/designer/printAreaValidator.js';

import { generatePrintPdf } from '../engines/print/pdfGenerator.js';
import { generatePrintPng } from '../engines/print/pngGenerator.js';
import { validateResolution } from '../engines/print/resolutionValidator.js';

import {
  uploadBuffer
} from '../services/storageService.js';

import {
  isOrderReadyForProduction
} from '../services/productionService.js';

const updateProgress = async (job, progress, message) => {
  if (typeof job?.updateProgress === 'function') {
    await job.updateProgress({
      percentage: progress,
      message
    });
  }
};

const getOrder = async (orderId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('id, customer_id, status, payment_status')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    throw new Error('Production order could not be found.');
  }

  return data;
};

const getArtworkBuffer = async (storagePath) => {
  if (!storagePath) {
    throw new Error('Artwork storage path is required.');
  }

  const { data, error } = await supabase.storage
    .from(env.STORAGE_BUCKET)
    .download(storagePath);

  if (error || !data) {
    throw new Error('Unable to retrieve original artwork from storage.');
  }

  return Buffer.from(await data.arrayBuffer());
};

const saveProductionFileRecord = async ({
  orderId,
  customerId,
  file
}) => {
  const { data, error } = await supabase
    .from('production_files')
    .insert({
      order_id: orderId,
      customer_id: customerId,
      file_name: file.fileName,
      storage_path: file.path,
      mime_type: file.mimeType,
      file_size: file.size,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const processProductionJob = async (job) => {
  const {
    orderId,
    artworkPath,
    printSettings
  } = job?.data || {};

  if (!orderId || !artworkPath || !printSettings) {
    throw new Error(
      'Production job requires orderId, artworkPath and printSettings.'
    );
  }

  const {
    width,
    height,
    bleed = 3,
    dpi = 300,
    printableArea,
    artworkBounds,
    safeMargin = 0,
    background
  } = printSettings;

  await updateProgress(job, 5, 'Checking order eligibility');

  const order = await getOrder(orderId);

  if (order.status !== 'production') {
    throw new Error('Order must be in production before file generation.');
  }

  if (order.payment_status !== 'paid') {
    throw new Error('Payment must be confirmed before production.');
  }

  const readiness = await isOrderReadyForProduction(orderId);

  if (!readiness.ready) {
    throw new Error('Customer-approved proof is required.');
  }

  await updateProgress(job, 15, 'Retrieving approved artwork');

  const artworkBuffer = await getArtworkBuffer(artworkPath);

  const artworkFile = {
    buffer: artworkBuffer,
    originalname: path.basename(artworkPath),
    mimetype: printSettings.mimeType
  };

  const artworkInfo = await parseArtwork(artworkFile);

  await updateProgress(job, 25, 'Validating print dimensions');

  if (!printableArea || !artworkBounds) {
    throw new Error(
      'Printable area and artwork bounds are required for production validation.'
    );
  }

  const areaValidation = validatePrintArea({
    canvas: {
      width: Number(printSettings.canvasWidth),
      height: Number(printSettings.canvasHeight)
    },
    printableArea,
    artworkBounds,
    bleed,
    safeMargin
  });

  if (!areaValidation.valid) {
    throw new Error(
      `Print-area validation failed: ${areaValidation.warnings.join(' ')}`
    );
  }

  if (artworkInfo.isRaster) {
    const resolution = await validateResolution({
      buffer: artworkBuffer,
      width,
      height,
      minDpi: dpi,
      allowUpscaling: false
    });

    if (!resolution.valid) {
      throw new Error(
        `Artwork resolution is insufficient: ${resolution.warnings.join(' ')}`
      );
    }
  }

  await updateProgress(job, 40, 'Generating print-ready PDF');

  const pdfResult = await generatePrintPdf({
    artworkBuffer,
    mimeType: artworkInfo.mimeType,
    width,
    height,
    bleed,
    dpi,
    background
  });

  await updateProgress(job, 60, 'Generating high-resolution PNG');

  let pngResult = null;

  if (artworkInfo.isRaster) {
    pngResult = await generatePrintPng({
      artworkBuffer,
      mimeType: artworkInfo.mimeType,
      width,
      height,
      bleed,
      dpi,
      background
    });
  }

  await updateProgress(job, 75, 'Uploading production files');

  const uploadedFiles = [];

  try {
    const pdfFile = await uploadBuffer({
      buffer: pdfResult.buffer,
      originalName: pdfResult.fileName,
      mimeType: pdfResult.mimeType,
      folder: 'production',
      customerId: order.customer_id
    });

    uploadedFiles.push({
      ...pdfFile,
      fileName: pdfResult.fileName,
      mimeType: pdfResult.mimeType
    });

    if (pngResult) {
      const pngFile = await uploadBuffer({
        buffer: pngResult.buffer,
        originalName: pngResult.fileName,
        mimeType: pngResult.mimeType,
        folder: 'production',
        customerId: order.customer_id
      });

      uploadedFiles.push({
        ...pngFile,
        fileName: pngResult.fileName,
        mimeType: pngResult.mimeType
      });
    }

    await updateProgress(job, 90, 'Saving production file records');

    const records = [];

    for (const file of uploadedFiles) {
      const record = await saveProductionFileRecord({
        orderId,
        customerId: order.customer_id,
        file
      });

      records.push(record);
    }

    await updateProgress(job, 100, 'Production files generated');

    return {
      success: true,
      orderId,
      approvedProofId: readiness.approvedProof.id,
      generatedCount: records.length,
      files: records,
      status: 'completed'
    };
  } catch (error) {
    // Remove uploaded files if the database records could not be saved.
    await Promise.allSettled(
      uploadedFiles.map((file) =>
        supabase.storage
          .from(env.STORAGE_BUCKET)
          .remove([file.path])
      )
    );

    throw error;
  }
};

export default processProductionJob;
