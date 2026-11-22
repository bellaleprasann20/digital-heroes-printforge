
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';

const normalizeProduct = (product) => {
  if (!product) return null;

  return {
    ...product,
    imageUrl: product.image_url || '',
    startingPrice: Number(product.base_price || 0),
    basePrice: Number(product.base_price || 0),
    isFeatured: product.is_featured,
    isActive: product.is_active,
    category: product.division,
    categoryName: product.categories?.name || '',
    categorySlug: product.categories?.slug || '',
    shortDescription:
      product.short_description ||
      product.description?.slice(0, 180) ||
      '',
  };
};

export default function useProducts({
  category = null,
  search = '',
  featured = false,
  page = 1,
  limit = 12,
  enabled = true,
} = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const safePage = Math.max(1, Number(page) || 1);
      const safeLimit = Math.min(
        500,
        Math.max(1, Number(limit) || 12)
      );

      const from = (safePage - 1) * safeLimit;
      const to = from + safeLimit - 1;

      let query = supabase
        .from('products')
        .select('*, categories(name, slug)', {
          count: 'exact',
        })
        .eq('is_active', true);

      // The database uses division, not category_slug.
      if (category) {
        query = query.eq('division', category);
      }

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (search.trim()) {
        const term = search.trim().replace(/[,%()]/g, '');

        if (term) {
          query = query.ilike('name', `%${term}%`);
        }
      }

      const {
        data,
        error: queryError,
        count,
      } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (queryError) throw queryError;

      setProducts((data || []).map(normalizeProduct));
      setTotal(count || 0);
    } catch (err) {
      console.error('Product loading failed:', err);

      setError(err.message || 'Unable to load products.');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [category, search, featured, page, limit, enabled]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / Math.max(1, Number(limit) || 12)
    ),
    refetch: fetchProducts,
  };
}

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', productId)
        .eq('is_active', true)
        .maybeSingle();

      if (queryError) throw queryError;

      setProduct(normalizeProduct(data));

      if (!data) {
        setError('Product not found.');
      }
    } catch (err) {
      console.error('Product details loading failed:', err);

      setProduct(null);
      setError(err.message || 'Unable to load product.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
