import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number(value) || 0);

export default function ManageOrders({
  orders = [],
  loading = false,
  error = '',
  onUpdateStatus,
  onRetry,
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => orders.filter((order) => {
    const query = search.trim().toLowerCase();
    const searchable = [
      order.orderNumber,
      order.customerName,
      order.customer?.name,
      order.customer?.email,
    ].map((value) => String(value || '').toLowerCase());

    return (!query || searchable.some((value) => value.includes(query))) &&
      (status === 'all' || String(order.status || '').toLowerCase() === status);
  }), [orders, search, status]);

  const updateStatus = async (order, nextStatus) => {
    if (!onUpdateStatus) return;
    const id = order.id || order._id;
    setBusyId(id);
    try {
      await onUpdateStatus(order, nextStatus);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-800">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm font-bold text-red-800 underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Order operations</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Manage orders</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Search orders and monitor their progress through the workflow.</p>
      </header>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order number or customer..." className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]" />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-sm">
            <option value="all">All statuses</option>
            {['quote', 'order', 'artwork', 'proof', 'production', 'completed', 'cancelled'].map((item) => (
              <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">{filtered.length} matching orders</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {filtered.length === 0 ? (
          <p className="p-10 text-center text-sm text-[var(--color-muted)]">No matching orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-[var(--color-background)] text-xs text-[var(--color-muted)]">
                <tr>
                  <th className="px-5 py-4">Order</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Workflow status</th>
                  <th className="px-5 py-4">Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const id = order.id || order._id;
                  return (
                    <tr key={id} className="border-t border-[var(--color-border)]">
                      <td className="px-5 py-4 font-semibold text-[var(--color-heading)]">
                        <Link to={`/admin/orders/${id}`} className="hover:text-[#b85f39]">{order.orderNumber || id}</Link>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[var(--color-heading)]">{order.customerName || order.customer?.name || '—'}</p>
                        <p className="text-xs text-[var(--color-muted)]">{order.customer?.email || order.email || ''}</p>
                      </td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-5 py-4 capitalize text-[var(--color-muted)]">{order.paymentStatus || order.payment?.status || '—'}</td>
                      <td className="px-5 py-4 font-semibold text-[var(--color-heading)]">{formatCurrency(order.totalAmount ?? order.total)}</td>
                      <td className="px-5 py-4 capitalize text-[var(--color-muted)]">{String(order.status || 'quote').replaceAll('_', ' ')}</td>
                      <td className="px-5 py-4">
                        <select
                          aria-label={`Update status for ${order.orderNumber || id}`}
                          value={order.status || 'quote'}
                          disabled={!onUpdateStatus || busyId === id}
                          onChange={(event) => updateStatus(order, event.target.value)}
                          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-2 text-xs disabled:opacity-50"
                        >
                          {['quote', 'order', 'artwork', 'proof', 'production', 'completed', 'cancelled'].map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}