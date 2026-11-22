
import supabase from '../config/supabase.js';

export const createProofVersion = async ({
  orderId,
  customerId,
  previewPath,
  filePath,
  revisionNote = null
}) => {
  if (!orderId || !customerId || !previewPath || !filePath) {
    throw new Error('Order, customer and proof file paths are required.');
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, customer_id')
    .eq('id', orderId)
    .eq('customer_id', customerId)
    .single();

  if (orderError || !order) {
    throw new Error('Customer order not found.');
  }

  const { data: previous, error: previousError } = await supabase
    .from('proofs')
    .select('version')
    .eq('order_id', orderId)
    .order('version', { ascending: false })
    .limit(1);

  if (previousError) throw previousError;

  const nextVersion = Number(previous?.[0]?.version || 0) + 1;

  const { error: supersedeError } = await supabase
    .from('proofs')
    .update({ status: 'superseded' })
    .eq('order_id', orderId)
    .in('status', ['pending', 'changes_requested']);

  if (supersedeError) throw supersedeError;

  const { data, error } = await supabase
    .from('proofs')
    .insert({
      order_id: orderId,
      customer_id: customerId,
      version: nextVersion,
      preview_path: previewPath,
      file_path: filePath,
      status: 'pending',
      revision_note: revisionNote
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getProofHistory = async ({
  orderId,
  customerId
}) => {
  const { data, error } = await supabase
    .from('proofs')
    .select('*')
    .eq('order_id', orderId)
    .eq('customer_id', customerId)
    .order('version', { ascending: false });

  if (error) throw error;

  return data;
};

export const approveProofVersion = async ({
  proofId,
  customerId
}) => {
  const { data: proof, error: findError } = await supabase
    .from('proofs')
    .select('*')
    .eq('id', proofId)
    .eq('customer_id', customerId)
    .single();

  if (findError || !proof) {
    throw new Error('Proof not found.');
  }

  if (!['pending', 'changes_requested'].includes(proof.status)) {
    throw new Error('This proof version cannot be approved.');
  }

  const { data, error } = await supabase
    .from('proofs')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: customerId
    })
    .eq('id', proofId)
    .eq('customer_id', customerId)
    .eq('status', proof.status)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const requestProofRevision = async ({
  proofId,
  customerId,
  message
}) => {
  const revisionMessage = String(message || '').trim();

  if (revisionMessage.length < 5 || revisionMessage.length > 2000) {
    throw new Error('Revision instructions must be between 5 and 2000 characters.');
  }

  const { data, error } = await supabase
    .from('proofs')
    .update({
      status: 'changes_requested',
      revision_note: revisionMessage
    })
    .eq('id', proofId)
    .eq('customer_id', customerId)
    .in('status', ['pending', 'changes_requested'])
    .select()
    .single();

  if (error) throw error;

  return data;
};

export default {
  createProofVersion,
  getProofHistory,
  approveProofVersion,
  requestProofRevision
};
