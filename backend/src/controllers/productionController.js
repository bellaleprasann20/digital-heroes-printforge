
import supabase from '../config/supabase.js';

export const getProductionQueue = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), proofs(*)')
      .in('status', ['production', 'approved', 'artwork', 'proof'])
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.json({
      success: true,
      jobs: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProductionStage = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedTransitions = {
      approved: ['production'],
      production: ['completed'],
      completed: []
    };

    if (!Object.hasOwn(allowedTransitions, status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid production stage.'
      });
    }

    const { data: order, error: findError } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', req.params.orderId)
      .single();

    if (findError || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    if (!allowedTransitions[order.status]?.includes(status)) {
      return res.status(409).json({
        success: false,
        message: `Cannot move order from ${order.status} to ${status}.`
      });
    }

    if (status === 'production') {
      const { data: proofs, error: proofError } = await supabase
        .from('proofs')
        .select('id')
        .eq('order_id', order.id)
        .eq('status', 'approved');

      if (proofError) throw proofError;

      if (!proofs?.length) {
        return res.status(403).json({
          success: false,
          message: 'An approved proof is required before production.'
        });
      }
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', order.id)
      .eq('status', order.status)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      order: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getProductionFiles = async (req, res) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', req.params.orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    const { data: proofs, error: proofError } = await supabase
      .from('proofs')
      .select('id')
      .eq('order_id', order.id)
      .eq('status', 'approved');

    if (proofError) throw proofError;

    if (!proofs?.length) {
      return res.status(403).json({
        success: false,
        message: 'Production files are locked until proof approval.'
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Production file generation and secure downloads are not configured yet.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
