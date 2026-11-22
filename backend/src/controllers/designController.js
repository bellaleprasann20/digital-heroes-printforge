
import supabase from '../config/supabase.js';

const normalizeDesignPayload = (body = {}) => {
  const designData = body.design_data || {};
  const dimensions = designData.dimensions || body.dimensions || {};

  return {
    name: body.name,
    product_id: body.product_id || body.productId,
    design_data: designData,
    canvas_width: Number(dimensions.width || body.canvas_width || 1200),
    canvas_height: Number(dimensions.height || body.canvas_height || 800),
    canvas_unit: dimensions.unit || body.canvas_unit || 'px',
    thumbnail_url:
      body.thumbnail_url ||
      body.thumbnailUrl ||
      body.preview_url ||
      body.previewUrl ||
      null,
  };
};

export const getDesigns = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('customer_id', req.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return res.json({
      success: true,
      designs: data || [],
    });
  } catch (error) {
    console.error('Get designs error:', error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDesignById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      design: data,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Design not found.',
    });
  }
};

export const createDesign = async (req, res) => {
  try {
    const payload = normalizeDesignPayload(req.body);

    if (!payload.name || !payload.product_id || !payload.design_data) {
      return res.status(400).json({
        success: false,
        message: 'Name, product and design data are required.',
      });
    }

    const { data, error } = await supabase
      .from('designs')
      .insert({
        customer_id: req.user.id,
        ...payload,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      design: data,
    });
  } catch (error) {
    console.error('Create design error:', error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDesign = async (req, res) => {
  try {
    const updates = {};

    if (req.body.name !== undefined) {
      updates.name = req.body.name;
    }

    if (req.body.design_data !== undefined) {
      updates.design_data = req.body.design_data;

      const dimensions = req.body.design_data?.dimensions || {};

      if (dimensions.width) {
        updates.canvas_width = Number(dimensions.width);
      }

      if (dimensions.height) {
        updates.canvas_height = Number(dimensions.height);
      }

      if (dimensions.unit) {
        updates.canvas_unit = dimensions.unit;
      }
    }

    const thumbnail =
      req.body.thumbnail_url ??
      req.body.thumbnailUrl ??
      req.body.preview_url ??
      req.body.previewUrl;

    if (thumbnail !== undefined) {
      updates.thumbnail_url = thumbnail || null;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid design fields supplied.',
      });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('designs')
      .update(updates)
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      design: data,
    });
  } catch (error) {
    console.error('Update design error:', error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('designs')
      .delete()
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .select('id');

    if (error) throw error;

    if (!data?.length) {
      return res.status(404).json({
        success: false,
        message: 'Design not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Design deleted successfully.',
    });
  } catch (error) {
    console.error('Delete design error:', error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const duplicateDesign = async (req, res) => {
  try {
    const { data: original, error: findError } = await supabase
      .from('designs')
      .select('*')
      .eq('id', req.params.id)
      .eq('customer_id', req.user.id)
      .single();

    if (findError || !original) {
      return res.status(404).json({
        success: false,
        message: 'Design not found.',
      });
    }

    const { data, error } = await supabase
      .from('designs')
      .insert({
        customer_id: req.user.id,
        product_id: original.product_id,
        name: `${original.name} (Copy)`,
        canvas_width: original.canvas_width,
        canvas_height: original.canvas_height,
        canvas_unit: original.canvas_unit,
        design_data: original.design_data,
        thumbnail_url: original.thumbnail_url,
        source_file_path: original.source_file_path,
        status: 'draft',
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      design: data,
    });
  } catch (error) {
    console.error('Duplicate design error:', error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
