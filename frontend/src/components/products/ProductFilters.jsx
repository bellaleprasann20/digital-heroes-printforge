
import React from 'react';

export default function ProductFilters({
  search = '',
  onSearchChange,
  category = 'all',
  onCategoryChange,
  categories = [],
  sortBy = 'featured',
  onSortChange,
  onClear,
}) {
  const hasFilters = search.trim() !== '' || category !== 'all' || sortBy !== 'featured';

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-4 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="product-search"
            className="mb-2 block text-xs font-bold text-[var(--color-heading)]"
          >
            Search products
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--color-muted)]">
              ⌕
            </span>
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search by product name..."
              className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] pl-11 pr-4 text-sm text-[var(--color-heading)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="product-category"
            className="mb-2 block text-xs font-bold text-[var(--color-heading)]"
          >
            Product division
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => onCategoryChange?.(event.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm text-[var(--color-heading)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="all">All divisions</option>
            {categories.map((item) => {
              const value = typeof item === 'string' ? item : item.value;
              const label = typeof item === 'string' ? item : item.label;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label
            htmlFor="product-sort"
            className="mb-2 block text-xs font-bold text-[var(--color-heading)]"
          >
            Sort by
          </label>
          <select
            id="product-sort"
            value={sortBy}
            onChange={(event) => onSortChange?.(event.target.value)}
            className="h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 text-sm text-[var(--color-heading)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="featured">Featured</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="newest">Newest first</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasFilters}
          className="h-12 rounded-lg border border-[var(--color-border)] px-5 text-sm font-bold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>
    </section>
  );
}
