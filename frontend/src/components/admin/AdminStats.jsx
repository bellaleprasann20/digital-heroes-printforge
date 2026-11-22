
import React from 'react';

const defaultMetrics = [
  { key: 'totalOrders', label: 'Total orders', icon: '▤', color: 'blue' },
  { key: 'activeJobs', label: 'Active jobs', icon: '⚙', color: 'purple' },
  { key: 'pendingProofs', label: 'Pending proofs', icon: '◷', color: 'amber' },
  { key: 'totalRevenue', label: 'Total revenue', icon: '₹', color: 'green', format: 'currency' },
];

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  amber: 'bg-amber-50 text-amber-700',
  green: 'bg-emerald-50 text-emerald-700',
};

const formatValue = (value, format, currency) => {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  }

  return Number(value ?? 0).toLocaleString('en-IN');
};

const AdminStats = ({
  stats = {},
  loading = false,
  definitions = defaultMetrics,
  currency = 'INR',
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {definitions.map((metric) => (
        <article
          key={metric.key}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              {metric.label}
            </p>
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colorStyles[metric.color] || colorStyles.blue}`}>
              {metric.icon}
            </span>
          </div>

          {loading ? (
            <div className="mt-5 h-9 w-28 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
          ) : (
            <p className="mt-4 break-words text-2xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-3xl">
              {formatValue(stats[metric.key], metric.format, currency)}
            </p>
          )}

          {metric.description && (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              {metric.description}
            </p>
          )}
        </article>
      ))}
    </div>
  );
};

export default AdminStats;
