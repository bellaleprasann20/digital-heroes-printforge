
import crypto from 'node:crypto';
import path from 'node:path';
import supabase from '../config/supabase.js';
import { env } from '../config/env.js';

const bucket = env.STORAGE_BUCKET;

const safeSegment = (value) =>
  String(value || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 80);

export const uploadBuffer = async ({
  buffer,
  originalName,
  mimeType,
  folder = 'artwork',
  customerId
}) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('A valid file buffer is required.');
  }

  if (!customerId) {
    throw new Error('Customer ID is required.');
  }

  const safeFolder = safeSegment(folder);
  const safeCustomerId = safeSegment(customerId);

  if (!safeFolder || !safeCustomerId) {
    throw new Error('Invalid storage folder or customer ID.');
  }

  const extension = path.extname(originalName || '').toLowerCase();

  if (!extension) {
    throw new Error('File extension is required.');
  }

  const uniqueName = `${crypto.randomUUID()}${extension}`;

  const storagePath = `${safeFolder}/${safeCustomerId}/${uniqueName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: mimeType || 'application/octet-stream',
      upsert: false
    });

  if (error) throw error;

  return {
    path: data.path,
    bucket,
    fileName: uniqueName,
    originalName,
    mimeType,
    size: buffer.length
  };
};

export const createSignedDownloadUrl = async (
  storagePath,
  expiresIn = 300
) => {
  if (!storagePath) {
    throw new Error('Storage path is required.');
  }

  const duration = Math.min(3600, Math.max(60, Number(expiresIn) || 300));

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, duration);

  if (error) throw error;

  return data.signedUrl;
};

export const deleteStoredFile = async (storagePath) => {
  if (!storagePath) {
    throw new Error('Storage path is required.');
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([storagePath]);

  if (error) throw error;

  return true;
};

export default {
  uploadBuffer,
  createSignedDownloadUrl,
  deleteStoredFile
};
