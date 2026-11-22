
import React from 'react';

const divisions = [
  { value: '', label: 'All divisions' },
  { value: 'labels_stickers', label: 'Labels & Stickers' },
  { value: 'race_numbers', label: 'Race & Event Numbers' },
  { value: 'mtb_boards', label: 'MTB Boards' },
  { value: 'stamps', label: 'Stamps' },
  { value: 'trophies', label: 'Trophies' },
  { value: 'laser_cut', label: 'Laser-cut Work' },
];

const statuses = [
  { value: '', label: 'All statuses' },
  { value: 'quote', label: 'Quote' },
  { value: 'order', label: 'Order' },
  { value: 'artwork', label: 'Artwork' },
  { value: 'proof', label: 'Proof' },
  { value: 'production', label: 'Production' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrderFilters = ({
  filters = {},
  onChange,
  onReset,
  className = '',
}) => {
  const update = (name, value) => {
    onChange?.({
      ...filters,
      [name]: value,
    });
  };

  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-[var(--color-heading)]">
            Filter orders
          </h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Find orders by customer, status, division, or date.
          </p>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="sm:col-span-2 xl:col-span-1">
          <label htmlFor="order-search" className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
            Search
          </label>
          <input
            id="order-search"
            type="search"
            value={filters.search || ''}
            onChange={(event) => update('search', event.target.value)}
            placeholder="Order ID, customer, email..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label htmlFor="order-status" className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
            Status
          </label>
          <select
            id="order-status"
            value={filters.status || ''}
            onChange={(event) => update('status', event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order-division" className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
            Division
          </label>
          <select
            id="order-division"
            value={filters.division || ''}
            onChange={(event) => update('division', event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          >
            {divisions.map((division) => (
              <option key={division.value} value={division.value}>
                {division.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="order-from" className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
            From date
          </label>
          <input
            id="order-from"
            type="date"
            value={filters.fromDate || ''}
            onChange={(event) => update('fromDate', event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label htmlFor="order-to" className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
            To date
          </label>
          <input
            id="order-to"
            type="date"
            min={filters.fromDate || undefined}
            value={filters.toDate || ''}
            onChange={(event) => update('toDate', event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          />
        </div>

        <div>
          <label htmlFor="order-sort" className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">
            Sort by
          </label>
          <select
            id="order-sort"
            value={filters.sort || 'newest'}
            onChange={(event) => update('sort', event.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="amount_high">Amount: high to low</option>
            <option value="amount_low">Amount: low to high</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default OrderFilters;
