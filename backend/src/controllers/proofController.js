
import supabase from '../config/supabase.js';

export const getProofs = async (req, res) => {
  try {
    let query = supabase
      .from('proofs')
      .select('*, orders(id, customer_id)')
      .order('created_at', { ascending: false });

    if (req.user.app_metadata?.role !== 'admin') {
      query = query.eq('customer_id', req.user.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.json({
      success: true,
      proofs: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProofVersions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('proofs')
      .select('*')
      .eq('order_id', req.params.orderId)
      .order('version', { ascending: false });

    if (error) throw error;

    if (
      req.user.app_metadata?.role !== 'admin' &&
      data.some((proof) => proof.customer_id !== req.user.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }

    return res.json({
      success: true,
      versions: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const approveProof = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: proof, error: findError } = await supabase
      .from('proofs')
      .select('*')
      .eq('id', id)
      .eq('customer_id', req.user.id)
      .single();

    if (findError || !proof) {
      return res.status(404).json({
        success: false,
        message: 'Proof not found.'
      });
    }

    if (!['pending', 'changes_requested'].includes(proof.status)) {
      return res.status(409).json({
        success: false,
        message: 'This proof version cannot be approved.'
      });
    }

    const { data, error } = await supabase
      .from('proofs')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: req.user.id
      })
      .eq('id', id)
      .eq('customer_id', req.user.id)
      .eq('status', proof.status)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      proof: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const requestChanges = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a detailed revision request.'
      });
    }

    const { data, error } = await supabase
      .from('proofs')
      .update({
        status: 'changes_requested',
        revision_note: message.trim()
      })
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .in('status', ['pending', 'changes_requested'])
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      proof: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
