import supabase from '../config/supabase.js';

const CATEGORY_TABLE = 'categories';

const makeSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const attachProductCounts = async (categories) => {
  const { data, error } = await supabase
    .from('products')
    .select('category_id');

  if (error) throw error;

  const counts = (data || []).reduce((result, product) => {
    result[product.category_id] = (result[product.category_id] || 0) + 1;
    return result;
  }, {});

  return categories.map((category) => ({
    ...category,
    productCount: counts[category.id] || 0
  }));
};

export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(CATEGORY_TABLE)
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    return res.json({
      success: true,
      categories: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAdminCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(CATEGORY_TABLE)
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    const categories = await attachProductCounts(data || []);

    return res.json({
      success: true,
      categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, image_url, display_order } = req.body;
    const slug = makeSlug(req.body.slug || name);

    if (!name?.trim() || !slug) {
      return res.status(400).json({
        success: false,
        message: 'A valid category name is required.'
      });
    }

    const { data, error } = await supabase
      .from(CATEGORY_TABLE)
      .insert({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        icon: icon || null,
        image_url: image_url || null,
        display_order: Number.isInteger(Number(display_order))
          ? Number(display_order)
          : 0,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      category: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      icon,
      image_url,
      display_order,
      is_active
    } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot be empty.'
        });
      }
      updates.name = String(name).trim();
    }

    if (slug !== undefined || name !== undefined) {
      updates.slug = makeSlug(slug || name);
    }

    if (description !== undefined) updates.description = description?.trim() || null;
    if (icon !== undefined) updates.icon = icon || null;
    if (image_url !== undefined) updates.image_url = image_url || null;

    if (display_order !== undefined) {
      const order = Number(display_order);
      if (!Number.isInteger(order)) {
        return res.status(400).json({
          success: false,
          message: 'Display order must be a whole number.'
        });
      }
      updates.display_order = order;
    }

    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields supplied.'
      });
    }

    const { data, error } = await supabase
      .from(CATEGORY_TABLE)
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      category: data
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from(CATEGORY_TABLE)
      .update({ is_active: false })
      .eq('id', req.params.id)
      .select('id')
      .single();

    if (error) throw error;

    return res.json({
      success: true,
      message: 'Category deactivated successfully.',
      categoryId: data.id
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
