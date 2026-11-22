
import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  loading = false,
  error = null,
  onRetry,
}) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white"
          >
            <div className="aspect-[4/3] animate-pulse bg-[#eeeae3]" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-1/3 animate-pulse rounded bg-[#eeeae3]" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-[#eeeae3]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#eeeae3]" />
              <div className="h-10 w-full animate-pulse rounded bg-[#eeeae3]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white px-5 py-16 text-center">
        <div className="text-3xl text-red-500">!</div>
        <h3 className="mt-3 text-lg font-bold text-[var(--color-heading)]">
          Unable to load products
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text)]">
          Something went wrong while loading the catalogue.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--color-primary-dark)]"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-5 py-16 text-center">
        <div className="text-4xl text-[var(--color-muted)]">◇</div>
        <h3 className="mt-4 text-lg font-bold text-[var(--color-heading)]">
          No products found
        </h3>
        <p className="mt-2 text-sm text-[var(--color-text)]">
          Try changing your filters or search for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id || product._id}
          product={product}
        />
      ))}
    </div>
  );
}
