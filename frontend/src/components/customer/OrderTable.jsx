
import React from 'react';
import { Link } from 'react-router-dom';

const statusStyles = {
  quote: 'bg-gray-100 text-gray-700',
  order: 'bg-blue-100 text-blue-700',
  artwork: 'bg-indigo-100 text-indigo-700',
  proof: 'bg-amber-100 text-amber-800',
  production: 'bg-purple-100 text-purple-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700',
};

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatMoney = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const OrderTable = ({
  orders = [],
  loading = false,
  error = null,
  onRetry,
  onViewOrder,
  onReorder,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${className}`}>
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--color-surface-soft)]" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl border border-red-200 bg-red-50 p-6 ${className}`}>
        <p className="font-semibold text-red-700">Unable to load orders</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <section className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-5">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Recent orders
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            View and manage your print orders.
          </p>
        </div>

        <Link
          to="/account/orders"
          className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          View all orders →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="text-3xl" aria-hidden="true">▤</div>
          <h3 className="mt-3 font-semibold text-[var(--color-heading)]">
            No orders yet
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Your orders will appear here after you place one.
          </p>
          <Link
            to="/products"
            className="mt-5 inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
          >
            Explore products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="bg-[var(--color-surface-soft)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
                <th className="px-5 py-4 font-semibold">Order</th>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {orders.map((order, index) => {
                const id = order.id || order._id;
                const status = String(order.status || 'pending').toLowerCase();
                const statusClass = statusStyles[status] || statusStyles.pending;

                return (
                  <tr key={id || index} className="transition hover:bg-[var(--color-surface-soft)]">
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold text-[var(--color-heading)]">
                        {order.orderNumber || order.orderId || id || '—'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--color-text)]">
                        {order.productName || order.items?.[0]?.name || 'Custom print order'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--color-muted)]">
                      {formatDate(order.createdAt || order.orderDate)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[var(--color-heading)]">
                      {formatMoney(order.totalAmount ?? order.total ?? order.amount, order.currency || 'INR')}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}>
                        {status.replaceAll('_', ' ')}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {onViewOrder && (
                          <button
                            type="button"
                            onClick={() => onViewOrder(order)}
                            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                          >
                            View
                          </button>
                        )}

                        {onReorder && (
                          <button
                            type="button"
                            onClick={() => onReorder(order)}
                            className="text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-heading)]"
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default OrderTable;
