import { supabase } from './supabase';

export const productService = {
  async getProducts({
    category,
    search,
    featured = false,
    page = 1,
    limit = 12,
  } = {}) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 12));
    const from = (safePage - 1) * safeLimit;

    let query = supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (category) query = query.eq('category_slug', category);
    if (featured) query = query.eq('is_featured', true);

    if (search?.trim()) {
      const term = search.trim().replace(/[,%()]/g, '');
      if (term) query = query.ilike('name', `%${term}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + safeLimit - 1);

    if (error) throw error;

    return {
      products: data || [],
      total: count || 0,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil((count || 0) / safeLimit),
    };
  },

  async getProductBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getFeaturedProducts(limit = 8) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};

export default productService;