
import supabase from '../config/supabase.js';

const PRODUCT_TABLE = 'products';

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      featured,
      search,
      page = 1,
      limit = 12
    } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 12));

    let query = supabase
      .from(PRODUCT_TABLE)
      .select('*, categories(name, slug)', { count: 'exact' })
      .eq('is_active', true);

    if (category) {
      query = query.eq('category_slug', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      const safeSearch = search.replace(/[,%()]/g, '');
      query = query.ilike('name', `%${safeSearch}%`);
    }

    const from = (pageNumber - 1) * pageSize;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw error;

    return res.json({
      success: true,
      products: data,
      pagination: {
        total: count || 0,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .select('*, categories(name, slug)')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      product: data
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.'
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, slug, description, category_id, base_price } = req.body;

    if (!name || !slug || !category_id || !Number.isFinite(Number(base_price)) || Number(base_price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product name, slug, category and base price are required.'
      });
    }

    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .insert({
        name,
        slug,
        description,
        category_id,
        base_price: Number(base_price),
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      product: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'slug',
      'description',
      'category_id',
      'base_price',
      'materials',
      'options',
      'image_url',
      'is_featured',
      'is_active'
    ];

    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields supplied.'
      });
    }

    if (
      updates.base_price !== undefined &&
      (!Number.isFinite(Number(updates.base_price)) || Number(updates.base_price) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid base price.'
      });
    }

    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      product: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from(PRODUCT_TABLE)
      .update({ is_active: false })
      .eq('id', req.params.id);

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Product deactivated successfully.'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
