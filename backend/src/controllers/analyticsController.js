
import supabase from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      customersResult,
      productsResult,
      ordersResult,
      revenueResult
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true }),

      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),

      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true }),

      supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
    ]);

    for (const result of [
      customersResult,
      productsResult,
      ordersResult,
      revenueResult
    ]) {
      if (result.error) throw result.error;
    }

    const revenue = (revenueResult.data || []).reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    return res.json({
      success: true,
      stats: {
        totalCustomers: customersResult.count || 0,
        activeProducts: productsResult.count || 0,
        totalOrders: ordersResult.count || 0,
        totalRevenue: Number(revenue.toFixed(2)),
        currency: 'INR'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('orders')
      .select('id, total_amount, created_at, payment_status')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: true });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    const grouped = new Map();

    for (const order of data || []) {
      const date = new Date(order.created_at)
        .toISOString()
        .slice(0, 10);

      const current = grouped.get(date) || {
        label: date,
        revenue: 0,
        orders: 0
      };

      current.revenue += Number(order.total_amount || 0);
      current.orders += 1;

      grouped.set(date, current);
    }

    return res.json({
      success: true,
      report: Array.from(grouped.values()).map((item) => ({
        ...item,
        revenue: Number(item.revenue.toFixed(2))
      }))
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
