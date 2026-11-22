
import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Loader from '../common/Loader';

function formatPrice(value, currency = 'INR') {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return 'Price on request';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function FeaturedProducts({
  products = [],
  loading = false,
  error = null,
  onRetry,
  onAddToCart,
}) {
  return (
    <section className="section bg-[var(--color-background)]">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="section-heading mb-0 max-w-2xl">
            <span className="eyebrow">Selected for you</span>
            <h2>
              Made to make
              <br />
              <span className="text-[var(--color-primary)]">an impression.</span>
            </h2>
            <p>
              Explore products selected from our print collection.
              Configure your requirements and get a price for your order.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-bold leading-none text-[var(--color-heading)] transition-colors hover:bg-white hover:text-[var(--color-primary)] md:self-end"
          >
            View all products
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-white py-10">
            <Loader label="Loading products..." />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 bg-white px-5 py-12 text-center">
            <p className="font-bold text-[var(--color-heading)]">
              We couldn't load the products.
            </p>
            <p className="mt-2 text-sm text-[var(--color-text)]">
              Please check your connection and try again.
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-bold leading-none text-white transition-colors hover:bg-[var(--color-primary-dark)]"
              >
                Try again
              </button>
            )}
          </div>
        ) : products.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-border)] bg-white px-5 py-16 text-center">
            <span className="text-4xl text-[var(--color-muted)]" aria-hidden="true">
              ◇
            </span>
            <h3 className="mt-4 text-lg font-bold text-[var(--color-heading)]">
              New products are on the way
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text)]">
              Our featured collection will appear here as soon as products
              are available.
            </p>
            <Link
              to="/products"
              className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-primary-light)]"
            >
              Browse the catalogue
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 8).map((product) => {
              const productId = product.id || product._id;
              const image = product.imageUrl || product.image || product.thumbnail;
              const productPath = `/products/${product.slug || productId}`;

              return (
                <article
                  key={productId}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(32,37,34,0.09)]"
                >
                  <Link
                    to={productPath}
                    className="relative block aspect-[4/3] shrink-0 overflow-hidden bg-[var(--color-surface-soft)]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={product.name || 'Print product'}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-5xl text-[#b7afa3]" aria-hidden="true">
                        ◇
                      </div>
                    )}

                    {product.isFeatured && (
                      <div className="absolute left-3 top-3">
                        <Badge variant="primary">Featured</Badge>
                      </div>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                      {product.categoryName || product.category || 'Print collection'}
                    </p>

                    <Link to={productPath} className="block">
                      <h3 className="mt-2 min-h-12 line-clamp-2 text-base font-bold leading-6 text-[var(--color-heading)] transition-colors group-hover:text-[var(--color-primary-dark)]">
                        {product.name || 'Untitled product'}
                      </h3>
                    </Link>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[var(--color-muted)]">
                          Starting from
                        </p>
                        <p className="mt-1 break-words text-base font-extrabold leading-6 text-[var(--color-heading)]">
                          {formatPrice(
                            product.startingPrice ?? product.basePrice ?? product.price,
                            product.currency || 'INR'
                          )}
                        </p>
                      </div>

                      <Link
                        to={productPath}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-lg font-bold leading-none text-[var(--color-primary-dark)] transition-all hover:bg-[var(--color-primary)] hover:text-white"
                        aria-label={`Configure ${product.name || 'product'}`}
                      >
                        ↗
                      </Link>
                    </div>

                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-4 py-3 text-xs font-bold leading-none text-[var(--color-heading)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
                      >
                        Quick add
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
