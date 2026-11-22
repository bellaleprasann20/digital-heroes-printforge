import supabase from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
  try {
const [
  customersResult,
  productsResult,
  ordersCountResult,
  revenueResult,
  proofsResult,
  ordersResult
] = await Promise.all([
  supabase
.from('profiles')
.select('id', { count: 'exact', head: true })
.eq('role', 'customer'),

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
.eq('payment_status', 'paid'),

  supabase
.from('proofs')
.select('id', { count: 'exact', head: true })
.eq('status', 'pending'),

  supabase
.from('orders')
.select('id, order_number, customer_id, status, total_amount, created_at')
.order('created_at', { ascending: false })
.limit(8)
]);


console.log('Dashboard query results:', [customersResult, productsResult, ordersCountResult, revenueResult, proofsResult, ordersResult].map((r) => ({ status: r.status, statusText: r.statusText, error: r.error })));

for (const result of [
  customersResult,
  productsResult,
  ordersCountResult,
  revenueResult,
  proofsResult,
  ordersResult
]) {
  if (result.error) throw result.error;
}

const allOrdersResult = await supabase
  .from('orders')
  .select('status');

if (allOrdersResult.error) throw allOrdersResult.error;

const statusCounts = {};

for (const order of allOrdersResult.data || []) {
  const status = order.status || 'unknown';
  statusCounts[status] = (statusCounts[status] || 0) + 1;
}

const revenue = (revenueResult.data || []).reduce(
  (sum, order) => sum + Number(order.total_amount || 0),
  0
);

const recentOrders = ordersResult.data || [];
const customerIds = [
  ...new Set(recentOrders.map((order) => order.customer_id).filter(Boolean))
];

let customerMap = {};

if (customerIds.length > 0) {
  const { data: customers, error } = await supabase
.from('profiles')
.select('id, full_name, email')
.in('id', customerIds);

  if (error) throw error;

  customerMap = Object.fromEntries(
(customers || []).map((customer) => [customer.id, customer])
  );
}

const totalOrders = ordersCountResult.count || 0;

const pendingOrders =
  (statusCounts.quote || 0) +
  (statusCounts.order || 0) +
  (statusCounts.artwork || 0) +
  (statusCounts.proof || 0);

const productionSummary = [
  { name: 'Quote', count: statusCounts.quote || 0 },
  { name: 'Order', count: statusCounts.order || 0 },
  { name: 'Artwork', count: statusCounts.artwork || 0 },
  { name: 'Proof', count: statusCounts.proof || 0 },
  { name: 'In Production', count: statusCounts.production || 0 },
  { name: 'Completed', count: statusCounts.completed || 0 }
].map((item) => ({
  ...item,
  percentage: totalOrders
? Math.round((item.count / totalOrders) * 100)
: 0
}));

return res.json({
  success: true,
  stats: {
totalOrders,
pendingOrders,
pendingProofs: proofsResult.count || 0,
inProduction: statusCounts.production || 0,
completedOrders: statusCounts.completed || 0,
totalCustomers: customersResult.count || 0,
totalProducts: productsResult.count || 0,
revenue: Number(revenue.toFixed(2)),
currency: 'INR'
  },
  recentOrders: recentOrders.map((order) => ({
id: order.id,
orderNumber: order.order_number,
customerName: customerMap[order.customer_id]?.full_name || 'Customer',
customerEmail: customerMap[order.customer_id]?.email || '',
status: order.status,
totalAmount: Number(order.total_amount || 0),
createdAt: order.created_at
  })),
  productionSummary
});
  } catch (error) {
console.error('Dashboard error name:', error?.name);
console.error('Dashboard error stack:', error?.stack);
console.dir(error, { depth: null });

return res.status(500).json({
  success: false,
  message: 'Unable to load dashboard data.'
});
  }
};

export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let ordersQuery = supabase
      .from('orders')
      .select('id, status, payment_status, total_amount, created_at')
      .order('created_at', { ascending: true });

    if (startDate) {
      ordersQuery = ordersQuery.gte('created_at', startDate);
    }

    if (endDate) {
      const inclusiveEndDate = /^\d{4}-\d{2}-\d{2}$/.test(endDate)
        ? `${endDate}T23:59:59.999Z`
        : endDate;

      ordersQuery = ordersQuery.lte('created_at', inclusiveEndDate);
    }

    const { data: orders, error: ordersError } = await ordersQuery;

    if (ordersError) throw ordersError;

    const allOrders = orders || [];
    const paidOrders = allOrders.filter(
      (order) => order.payment_status === 'paid'
    );

    const totalRevenue = paidOrders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const revenueByDate = new Map();

    for (const order of paidOrders) {
      const date = new Date(order.created_at).toISOString().slice(0, 10);
      const current = revenueByDate.get(date) || {
        label: date,
        revenue: 0,
        orders: 0
      };

      current.revenue += Number(order.total_amount || 0);
      current.orders += 1;
      revenueByDate.set(date, current);
    }

    const statusCounts = {};

    for (const order of allOrders) {
      const status = order.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }

    const ordersByStatus = Object.entries(statusCounts).map(
      ([status, count]) => ({
        status,
        count,
        percentage: allOrders.length
          ? Math.round((count / allOrders.length) * 100)
          : 0
      })
    );

    let topProducts = [];

    const orderIds = allOrders.map((order) => order.id);

    if (orderIds.length > 0) {
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, product_name, quantity, line_total')
        .in('order_id', orderIds);

      if (itemsError) throw itemsError;

      const productMap = new Map();

      for (const item of items || []) {
        const name = item.product_name || 'Unnamed product';
        const current = productMap.get(name) || {
          name,
          quantity: 0,
          orders: new Set(),
          revenue: 0
        };

        current.quantity += Number(item.quantity || 0);
        current.orders.add(item.order_id);
        current.revenue += Number(item.line_total || 0);

        productMap.set(name, current);
      }

      topProducts = Array.from(productMap.values())
        .map((product) => ({
          name: product.name,
          quantity: product.quantity,
          orders: product.orders.size,
          revenue: Number(product.revenue.toFixed(2))
        }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
    }

    return res.json({
      success: true,
      report: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: allOrders.length,
        averageOrderValue: paidOrders.length
          ? Number((totalRevenue / paidOrders.length).toFixed(2))
          : 0,
        completedOrders: statusCounts.completed || 0,
        revenueByPeriod: Array.from(revenueByDate.values()).map((item) => ({
          ...item,
          revenue: Number(item.revenue.toFixed(2))
        })),
        topProducts,
        ordersByStatus
      }
    });
  } catch (error) {
    console.error('Revenue report error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load revenue report.'
    });
  }
};
