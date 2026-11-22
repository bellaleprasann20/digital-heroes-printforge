import { Link } from 'react-router-dom';

const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const StatCard = ({ label, value, note, icon }) => (
  <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-[var(--color-muted)]">{label}</p>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c66b43]/10 text-lg text-[#b85f39]">
        {icon}
      </span>
    </div>
    <p className="mt-4 text-2xl font-bold text-[var(--color-heading)]">
      {value ?? '—'}
    </p>
    {note && <p className="mt-1 text-xs text-[var(--color-muted)]">{note}</p>}
  </article>
);

export default function AdminDashboard({
  stats = {},
  recentOrders = [],
  productionSummary = [],
  loading = false,
  error = '',
  onRetry,
}) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-[var(--color-border)]" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-800">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm font-bold text-red-800 underline">
          Try again
        </button>
      </div>
    );
  }

  const cards = [
    { label: 'Total orders', value: stats.totalOrders, note: 'All recorded orders', icon: '▤' },
    { label: 'Pending orders', value: stats.pendingOrders, note: 'Awaiting processing', icon: '◷' },
    { label: 'Pending proofs', value: stats.pendingProofs, note: 'Awaiting customer review', icon: '▧' },
    { label: 'In production', value: stats.inProduction, note: 'Currently being produced', icon: '⚙' },
    { label: 'Completed orders', value: stats.completedOrders, note: 'Successfully completed', icon: '✓' },
    { label: 'Customers', value: stats.totalCustomers, note: 'Registered customer accounts', icon: '♙' },
    { label: 'Products', value: stats.totalProducts, note: 'Active product catalogue', icon: '◇' },
    { label: 'Revenue', value: stats.revenue != null ? currency(stats.revenue) : '—', note: 'Based on recorded payments', icon: '₹' },
  ];

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Monitor orders, artwork approvals, production, and business activity.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] p-5">
            <div>
              <h2 className="font-bold text-[var(--color-heading)]">Recent orders</h2>
              <p className="mt-1 text-xs text-[var(--color-muted)]">Latest customer activity</p>
            </div>
            <Link to="/admin/orders" className="text-sm font-bold text-[#b85f39]">
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="p-6 text-sm text-[var(--color-muted)]">No order records available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left text-sm">
                <thead className="bg-[var(--color-background)] text-xs text-[var(--color-muted)]">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id || order._id} className="border-t border-[var(--color-border)]">
                      <td className="px-5 py-4 font-semibold text-[var(--color-heading)]">
                        <Link to={`/admin/orders/${order.id || order._id}`} className="hover:text-[#b85f39]">
                          {order.orderNumber || order.id || order._id}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">
                        {order.customerName || order.customer?.name || '—'}
                      </td>
                      <td className="px-5 py-4 capitalize text-[var(--color-muted)]">
                        {String(order.status || 'pending').replaceAll('_', ' ')}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold text-[var(--color-heading)]">
                        {currency(order.totalAmount ?? order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-[var(--color-heading)]">Production pipeline</h2>
              <p className="mt-1 text-xs text-[var(--color-muted)]">Current workload by stage</p>
            </div>
            <Link to="/admin/production" className="text-sm font-bold text-[#b85f39]">
              Open queue →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {productionSummary.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No production summary available.</p>
            ) : productionSummary.map((stage) => (
              <div key={stage.name || stage.status}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-[var(--color-heading)]">{stage.name || stage.status}</span>
                  <span className="text-[var(--color-muted)]">{stage.count ?? 0}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--color-background)]">
                  <div
                    className="h-full rounded-full bg-[#bd6540]"
                    style={{ width: `${Math.min(100, Math.max(0, Number(stage.percentage) || 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl bg-[#202a25] p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#e49a70]">
          Quick actions
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ['/admin/orders', 'Manage orders'],
            ['/admin/products', 'Manage products'],
            ['/admin/proofs', 'Review proofs'],
            ['/admin/production', 'Production queue'],
          ].map(([href, label]) => (
            <Link key={href} to={href} className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold transition hover:bg-white/10">
              {label} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}