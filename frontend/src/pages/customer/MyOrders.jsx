import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};

const filters = [
  { label: 'All orders', value: 'all' },
  { label: 'In progress', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const getStatus = (status) =>
  String(status || 'pending').toLowerCase().replaceAll(' ', '_');

const isActive = (status) =>
  ['quote', 'pending', 'artwork', 'proof', 'production'].includes(status);

const badgeClass = (status) => {
  if (status === 'completed') return 'bg-emerald-100 text-emerald-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-700';
  if (status === 'production') return 'bg-orange-100 text-orange-800';
  if (status === 'proof') return 'bg-violet-100 text-violet-800';
  return 'bg-amber-100 text-amber-800';
};

export default function MyOrders({
  orders = [],
  loading = false,
  error = '',
  onRetry,
}) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const status = getStatus(order.status);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && isActive(status)) ||
        status === filter;

      const matchesSearch =
        !query ||
        String(order.orderNumber || '').toLowerCase().includes(query) ||
        String(order.productName || '').toLowerCase().includes(query) ||
        String(order.id || order._id || '').toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  return (
    <div className="space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
            Your workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
            My orders
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            View order details and follow your production progress.
          </p>
        </div>
        <Link
          to="/products"
          className="rounded-xl bg-[#bd6540] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#a95432]"
        >
          Place an order →
        </Link>
      </header>

      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                filter === item.value
                  ? 'bg-[#202a25] text-white'
                  : 'bg-[var(--color-background)] text-[var(--color-muted)] hover:text-[var(--color-heading)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search order number..."
          aria-label="Search orders"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm outline-none focus:border-[#c66b43] sm:max-w-xs"
        />
      </div>

      {loading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-[var(--color-border)]" />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-bold text-red-800 underline"
          >
            Try again
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-16 text-center">
          <p className="text-lg font-bold text-[var(--color-heading)]">
            {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
          </p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {orders.length === 0
              ? 'Your placed orders will appear here.'
              : 'Try changing the filter or search term.'}
          </p>
          {orders.length === 0 && (
            <Link
              to="/products"
              className="mt-5 inline-block text-sm font-bold text-[#b85f39]"
            >
              Explore products →
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 border-b border-[var(--color-border)] bg-[var(--color-background)] px-5 py-4 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] md:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Total</span>
            <span />
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {filteredOrders.map((order) => {
              const id = order.id || order._id;
              const status = getStatus(order.status);

              return (
                <article
                  key={id}
                  className="grid gap-3 px-5 py-5 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-xs text-[var(--color-muted)] md:hidden">
                      Order
                    </p>
                    <p className="font-bold text-[var(--color-heading)]">
                      {order.orderNumber || `Order ${String(id).slice(-8)}`}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {order.productName || `${order.items?.length || 0} item(s)`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--color-muted)] md:hidden">
                      Date
                    </p>
                    <p className="text-sm text-[var(--color-text)]">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-[var(--color-muted)] md:hidden">
                      Status
                    </p>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeClass(status)}`}>
                      {status.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-[var(--color-muted)] md:hidden">
                      Total
                    </p>
                    <p className="text-sm font-bold text-[var(--color-heading)]">
                      {formatCurrency(order.totalAmount ?? order.total, order.currency)}
                    </p>
                  </div>

                  <Link
                    to={`/account/orders/${id}`}
                    className="text-sm font-bold text-[#b85f39] hover:underline"
                  >
                    Details →
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}