
import React from 'react';
import { Link } from 'react-router-dom';

function formatPrice(value, currency = 'INR') {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return 'Price on request';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function ProductCard({ product }) {
  if (!product) return null;

  const productId = product.id || product._id;
  const productPath = `/products/${product.slug || productId}`;
  const image = product.imageUrl || product.image || product.thumbnail;
  const startingPrice =
    product.startingPrice ?? product.basePrice ?? product.price;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(32,37,34,0.10)]">
      <Link
        to={productPath}
        className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-surface-soft)]"
      >
        {image ? (
          <img
            src={image}
            alt={product.name || 'Print product'}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-[#b7afa3]">
            ◇
          </div>
        )}

        {product.isFeatured && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-primary-dark)] shadow-sm">
            Featured
          </span>
        )}

        {product.badge && (
          <span className="absolute right-4 top-4 rounded-full bg-[var(--color-heading)] px-3 py-1.5 text-[10px] font-bold text-white">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
          {product.categoryName || product.category || 'Print collection'}
        </p>

        <Link to={productPath}>
          <h3 className="mt-2 line-clamp-2 text-lg font-bold tracking-tight text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-primary-dark)]">
            {product.name || 'Untitled product'}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[var(--color-text)]">
          {product.shortDescription || product.description || 'Explore configuration options for this custom print product.'}
        </p>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <div>
            <p className="text-[10px] text-[var(--color-muted)]">
              Starting from
            </p>
            <p className="mt-1 text-lg font-extrabold text-[var(--color-heading)]">
              {formatPrice(startingPrice, product.currency || 'INR')}
            </p>
          </div>

          <Link
            to={productPath}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            Configure <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
