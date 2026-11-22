
import supabase from '../config/supabase.js';
import {
  createSignedDownloadUrl
} from './storageService.js';

export const isOrderReadyForProduction = async (orderId) => {
  const { data: proofs, error } = await supabase
    .from('proofs')
    .select('id, version, status, approved_at')
    .eq('order_id', orderId)
    .eq('status', 'approved')
    .order('version', { ascending: false })
    .limit(1);

  if (error) throw error;

  return {
    ready: Boolean(proofs?.length),
    approvedProof: proofs?.[0] || null
  };
};

export const updateProductionStatus = async ({
  orderId,
  nextStatus
}) => {
  const transitions = {
    approved: ['production'],
    production: ['completed'],
    completed: []
  };

  const { data: order, error: findError } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .single();

  if (findError || !order) {
    throw new Error('Order not found.');
  }

  if (!transitions[order.status]?.includes(nextStatus)) {
    throw new Error(
      `Invalid production transition: ${order.status} to ${nextStatus}.`
    );
  }

  if (nextStatus === 'production') {
    const readiness = await isOrderReadyForProduction(orderId);

    if (!readiness.ready) {
      throw new Error('Customer approval is required before production.');
    }
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status: nextStatus })
    .eq('id', orderId)
    .eq('status', order.status)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getProductionFiles = async (orderId) => {
  const readiness = await isOrderReadyForProduction(orderId);

  if (!readiness.ready) {
    throw new Error('Production files are locked until proof approval.');
  }

  const { data: files, error } = await supabase
    .from('production_files')
    .select('id, file_name, storage_path, mime_type, created_at')
    .eq('order_id', orderId);

  if (error) throw error;

  const filesWithUrls = await Promise.all(
    (files || []).map(async (file) => ({
      ...file,
      downloadUrl: await createSignedDownloadUrl(file.storage_path)
    }))
  );

  return filesWithUrls;
};

export default {
  isOrderReadyForProduction,
  updateProductionStatus,
  getProductionFiles
};
