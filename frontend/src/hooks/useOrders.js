import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function useOrders({ enabled = true } = {}) {
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (authLoading) return;

    if (!enabled || !user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      setOrders(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load orders.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading, enabled]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading: loading || authLoading,
    error,
    refetch: fetchOrders,
  };
}

export function useOrder(orderId) {
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (authLoading) return;

    if (!orderId || !user) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_id', user.id)
        .maybeSingle();

      if (queryError) throw queryError;

      setOrder(data || null);

      if (!data) {
        setError('Order not found.');
      }
    } catch (err) {
      setOrder(null);
      setError(err.message || 'Unable to load order.');
    } finally {
      setLoading(false);
    }
  }, [orderId, user, authLoading]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading: loading || authLoading,
    error,
    refetch: fetchOrder,
  };
}