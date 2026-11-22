import supabase from '../config/supabase.js';

const PRODUCT_TABLE = 'products';

const PRODUCT_FIELDS = [
  'name',
  'slug',
  'description',
  'division',
  'category_id',
  'base_price',
  'currency',
  'default_width',
  'default_height',
  'dimension_unit',
  'min_width',
  'max_width',
  'min_height',
  'max_height',
  'print_dpi',
  'bleed_mm',
  'safe_margin_mm',
  'materials',
  'specifications',
  'image_url',
  'gallery_images',
  'is_active',
  'is_featured',
  'sort_order'
];

const isUuid = (value) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const getProductList = async (req, res, includeInactive = false) => {
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
      .select('*, categories(id, name, slug)', { count: 'exact' });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    if (category) {
      query = isUuid(category)
        ? query.eq('category_id', category)
        : query.eq('categories.slug', category);
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
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw error;

    return res.json({
      success: true,
      products: data || [],
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

export const getProducts = (req, res) =>
  getProductList(req, res, false);

export const getAdminProducts = (req, res) =>
  getProductList(req, res, true);

export const getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .select('*, categories(id, name, slug)')
      .eq('id', req.params.id)
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
    const {
      name,
      slug,
      division,
      category_id,
      base_price,
      ...otherFields
    } = req.body;

    if (
      !name?.trim() ||
      !slug?.trim() ||
      !division?.trim() ||
      !category_id ||
      !Number.isFinite(Number(base_price)) ||
      Number(base_price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Product name, slug, division, category and a valid base price are required.'
      });
    }

    const product = {
      name: name.trim(),
      slug: slug.trim(),
      division: division.trim(),
      category_id,
      base_price: Number(base_price),
      is_active: true
    };

    for (const field of PRODUCT_FIELDS) {
      if (
        field in otherFields &&
        !['name', 'slug', 'division', 'category_id', 'base_price', 'is_active'].includes(field)
      ) {
        product[field] = otherFields[field];
      }
    }

    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .insert(product)
      .select('*, categories(id, name, slug)')
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
    const updates = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => PRODUCT_FIELDS.includes(key))
    );

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid product fields supplied.'
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

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name cannot be empty.'
      });
    }

    if (updates.division !== undefined && !String(updates.division).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product division cannot be empty.'
      });
    }

    if (updates.base_price !== undefined) {
      updates.base_price = Number(updates.base_price);
    }

    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .update(updates)
      .eq('id', req.params.id)
      .select('*, categories(id, name, slug)')
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
    const { data, error } = await supabase
      .from(PRODUCT_TABLE)
      .update({ is_active: false })
      .eq('id', req.params.id)
      .select('id')
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Product deactivated successfully.',
      productId: data.id
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
