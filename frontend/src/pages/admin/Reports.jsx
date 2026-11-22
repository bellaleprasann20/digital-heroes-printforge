import { useMemo, useState } from 'react';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Number(value) || 0);

export default function Reports({
  report = null,
  loading = false,
  error = '',
  onDateRangeChange,
  onExport,
  onRetry,
}) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const rows = Array.isArray(report?.revenueByPeriod) ? report.revenueByPeriod : [];
  const maxRevenue = useMemo(
    () => Math.max(1, ...rows.map((item) => Number(item.revenue) || 0)),
    [rows]
  );

  const applyRange = (event) => {
    event.preventDefault();
    if (from && to && from > to) return;
    onDateRangeChange?.({ from, to });
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

  const metrics = [
    ['Revenue', report?.totalRevenue != null ? formatCurrency(report.totalRevenue) : '—'],
    ['Orders', report?.totalOrders ?? '—'],
    ['Average order value', report?.averageOrderValue != null ? formatCurrency(report.averageOrderValue) : '—'],
    ['Completed orders', report?.completedOrders ?? '—'],
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Business intelligence</p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Reports & analytics</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Review sales, order activity, and product performance.</p>
        </div>
        <button
          type="button"
          disabled={!onExport}
          onClick={() => onExport?.({ from, to, report })}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-bold text-[var(--color-heading)] disabled:opacity-50"
        >
          Export report
        </button>
      </header>

      <form onSubmit={applyRange} className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-semibold text-[var(--color-heading)]">
          From
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 font-normal" />
        </label>
        <label className="flex-1 text-sm font-semibold text-[var(--color-heading)]">
          To
          <input type="date" value={to} min={from || undefined} onChange={(event) => setTo(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 font-normal" />
        </label>
        <button type="submit" className="rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white">Apply range</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article key={label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="text-sm text-[var(--color-muted)]">{label}</p>
            <p className="mt-3 text-2xl font-bold text-[var(--color-heading)]">{value}</p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
        <div>
          <h2 className="font-bold text-[var(--color-heading)]">Revenue over time</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Values supplied by the reporting service</p>
        </div>

        {rows.length === 0 ? (
          <p className="py-12 text-center text-sm text-[var(--color-muted)]">No revenue data available for this period.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {rows.map((item, index) => (
              <div key={item.label || item.date || index}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="text-[var(--color-muted)]">{item.label || item.date}</span>
                  <span className="font-semibold text-[var(--color-heading)]">{formatCurrency(item.revenue)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--color-background)]">
                  <div className="h-full rounded-full bg-[#bd6540]" style={{ width: `${Math.max(0, Math.min(100, (Number(item.revenue) / maxRevenue) * 100))}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="font-bold text-[var(--color-heading)]">Top products</h2>
          {report?.topProducts?.length ? (
            <div className="mt-4 divide-y divide-[var(--color-border)]">
              {report.topProducts.map((product, index) => (
                <div key={product.id || product._id || product.name || index} className="flex justify-between gap-3 py-3 text-sm">
                  <span className="text-[var(--color-heading)]">{product.name}</span>
                  <span className="text-[var(--color-muted)]">{product.orders ?? product.quantity ?? '—'}</span>
                </div>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-[var(--color-muted)]">No product performance data available.</p>}
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="font-bold text-[var(--color-heading)]">Order status breakdown</h2>
          {report?.ordersByStatus?.length ? (
            <div className="mt-4 space-y-4">
              {report.ordersByStatus.map((item) => (
                <div key={item.status}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="capitalize text-[var(--color-heading)]">{String(item.status).replaceAll('_', ' ')}</span>
                    <span className="text-[var(--color-muted)]">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[var(--color-background)]">
                    <div className="h-full rounded-full bg-[#bd6540]" style={{ width: `${Math.max(0, Math.min(100, Number(item.percentage) || 0))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="mt-4 text-sm text-[var(--color-muted)]">No order status data available.</p>}
        </section>
      </div>
    </div>
  );
}