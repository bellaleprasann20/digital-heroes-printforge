
import React from 'react';

const defaultStats = [
  { key: 'totalOrders', label: 'Total orders', icon: '▤', color: 'blue' },
  { key: 'inProduction', label: 'In production', icon: '⚙', color: 'amber' },
  { key: 'awaitingApproval', label: 'Awaiting approval', icon: '◷', color: 'purple' },
  { key: 'completed', label: 'Completed', icon: '✓', color: 'green' },
];

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700',
  amber: 'bg-amber-50 text-amber-700',
  purple: 'bg-purple-50 text-purple-700',
  green: 'bg-emerald-50 text-emerald-700',
};

const StatsCards = ({
  stats = {},
  loading = false,
  definitions = defaultStats,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${className}`}>
      {definitions.map((item) => (
        <article
          key={item.key}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-[var(--color-muted)]">
              {item.label}
            </p>

            <span className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${colorStyles[item.color] || colorStyles.blue}`}>
              {item.icon}
            </span>
          </div>

          {loading ? (
            <div className="mt-5 h-9 w-20 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
          ) : (
            <p className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--color-heading)]">
              {Number(stats[item.key] ?? 0).toLocaleString('en-IN')}
            </p>
          )}

          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Based on your order activity
          </p>
        </article>
      ))}
    </div>
  );
};

export default StatsCards;
