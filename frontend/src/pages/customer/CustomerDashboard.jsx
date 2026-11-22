
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';

const IN_PROGRESS_STATUSES = [
  'order',
  'artwork',
  'proof',
  'production',
];

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));

const formatDate = (date) => {
  if (!date) return 'Date unavailable';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Date unavailable';
  }

  return parsedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatStatus = (status) => {
  if (!status) return 'Unknown';

  return status
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getStatusClasses = (status) => {
  switch (String(status || '').toLowerCase()) {
    case 'completed':
    case 'paid':
      return 'bg-green-100 text-green-700';

    case 'cancelled':
    case 'failed':
      return 'bg-red-100 text-red-700';

    case 'pending':
    case 'quote':
    case 'processing':
      return 'bg-amber-100 text-amber-700';

    default:
      return 'bg-blue-100 text-blue-700';
  }
};

function StatCard({ label, value, description }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <p className="text-sm font-medium text-[var(--color-muted)]">
        {label}
      </p>

      <p className="mt-3 text-3xl font-bold text-[var(--color-heading)]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[var(--color-muted)]">
        {description}
      </p>
    </div>
  );
}

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await orderService.getMyOrders({
        page: 1,
        limit: 5,
      });

      setOrders(
        Array.isArray(response?.orders)
          ? response.orders
          : []
      );
    } catch (err) {
      setError(
        err.message || 'Unable to load your orders.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalOrders = orders.length;

  const inProgressOrders = orders.filter((order) =>
    IN_PROGRESS_STATUSES.includes(
      String(order.status || '').toLowerCase()
    )
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      String(order.status || '').toLowerCase() === 'completed'
  ).length;

  const pendingPayments = orders.filter(
    (order) =>
      String(order.payment_status || '').toLowerCase() === 'pending'
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-primary)]">
          Customer Workspace
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-heading)] sm:text-3xl">
              Welcome to your dashboard
            </h1>

            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Track your print orders, payments, and production progress.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-3 text-sm font-semibold text-red-700 underline"
          >
            Try again
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={loading ? '—' : totalOrders}
          description="Orders placed through your account"
        />

        <StatCard
          label="In Progress"
          value={loading ? '—' : inProgressOrders}
          description="Orders being processed"
        />

        <StatCard
          label="Completed"
          value={loading ? '—' : completedOrders}
          description="Successfully completed orders"
        />

        <StatCard
          label="Pending Payments"
          value={loading ? '—' : pendingPayments}
          description="Orders awaiting payment"
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--color-border)] p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[var(--color-heading)]">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Your latest order activity
            </p>
          </div>

          <Link
            to="/account/orders"
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            View all orders
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-[var(--color-surface-soft)]"
              />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-2xl">
              📦
            </div>

            <h3 className="mt-4 text-lg font-semibold text-[var(--color-heading)]">
              No orders yet
            </h3>

            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Your orders will appear here after you complete checkout.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-[var(--color-surface-soft)]">
                <tr className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                  <th className="px-5 py-4 font-semibold">Order</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Order Status</th>
                  <th className="px-5 py-4 font-semibold">Payment</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => {
                  const orderId = order.id;
                  const displayId =
                    order.order_number ||
                    (orderId ? String(orderId).slice(0, 8) : 'N/A');

                  return (
                    <tr
                      key={orderId}
                      className="border-t border-[var(--color-border)] text-sm"
                    >
                      <td className="px-5 py-4">
                        <Link
                          to={`/account/orders/${orderId}`}
                          className="font-semibold text-[var(--color-primary)] hover:underline"
                        >
                          #{displayId}
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-[var(--color-muted)]">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[var(--color-heading)]">
                        {formatCurrency(
                          order.total_amount,
                          order.currency || 'INR'
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(order.payment_status)}`}
                        >
                          {formatStatus(order.payment_status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/account/orders"
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]"
        >
          <h3 className="font-bold text-[var(--color-heading)]">
            Manage Your Orders
          </h3>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Review order details and follow your order progress.
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)]">
            View orders →
          </span>
        </Link>

        <Link
          to="/cart"
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-primary)]"
        >
          <h3 className="font-bold text-[var(--color-heading)]">
            Continue Shopping
          </h3>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Explore products and prepare your next print order.
          </p>

          <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-primary)]">
            Open cart →
          </span>
        </Link>
      </section>
    </div>
  );
}
