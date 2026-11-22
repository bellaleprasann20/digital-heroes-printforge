
import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const categories = [
  { value: '', label: 'All products' },
  { value: 'labels_stickers', label: 'Labels & Stickers' },
  { value: 'race_numbers', label: 'Race & Event Numbers' },
  { value: 'mtb_boards', label: 'MTB Boards' },
  { value: 'stamps', label: 'Stamps' },
  { value: 'trophies', label: 'Trophies' },
  { value: 'laser_cut', label: 'Laser-cut Work' },
];

// Supports database division values and category URL slugs.
const categoryMap = {
  'labels-stickers': 'labels_stickers',
  labels_stickers: 'labels_stickers',

  'race-event-numbers': 'race_numbers',
  'race-numbers': 'race_numbers',
  race_numbers: 'race_numbers',

  'mtb-boards': 'mtb_boards',
  mtb_boards: 'mtb_boards',

  stamps: 'stamps',
  trophies: 'trophies',

  'laser-cut': 'laser_cut',
  laser_cut: 'laser_cut',
};

const formatMoney = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const Products = ({
  products = [],
  loading = false,
  error = null,
  onRetry,
  onAddToCart,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get('search') || ''
  );

  const [sort, setSort] = useState('featured');

  const activeCategory = searchParams.get('category') || '';

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filtering
    if (activeCategory) {
      const selectedDivision =
        categoryMap[activeCategory] || activeCategory;

      result = result.filter((product) => {
        const productDivision =
          product.division || product.category;

        const productCategorySlug =
          product.categorySlug || product.categories?.slug;

        return (
          productDivision === selectedDivision ||
          productCategorySlug === activeCategory
        );
      });
    }

    // Search filtering
    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) =>
        [
          product.name,
          product.title,
          product.shortDescription,
          product.description,
          product.categoryName,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          )
      );
    }

    // Sorting
    if (sort === 'price_low') {
      result.sort(
        (a, b) =>
          Number(a.startingPrice ?? a.basePrice ?? a.price ?? 0) -
          Number(b.startingPrice ?? b.basePrice ?? b.price ?? 0)
      );
    } else if (sort === 'price_high') {
      result.sort(
        (a, b) =>
          Number(b.startingPrice ?? b.basePrice ?? b.price ?? 0) -
          Number(a.startingPrice ?? a.basePrice ?? a.price ?? 0)
      );
    } else if (sort === 'name') {
      result.sort((a, b) =>
        String(a.name || '').localeCompare(String(b.name || ''))
      );
    } else if (sort === 'featured') {
      result.sort(
        (a, b) =>
          Number(Boolean(b.isFeatured)) -
          Number(Boolean(a.isFeatured))
      );
    }

    return result;
  }, [products, activeCategory, search, sort]);

  const selectCategory = (value) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set('category', value);
    } else {
      next.delete('category');
    }

    setSearchParams(next);
  };

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow">The PrintForge collection</p>

          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-5xl">
            Print made for the way you work.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
            Explore specialist print products, customise your requirements,
            and create artwork that is ready for production.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Browse the catalogue</p>

            <h2 className="mt-2 text-2xl font-bold text-[var(--color-heading)]">
              Find your product
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>

            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] sm:w-64"
            />

            <label className="sr-only" htmlFor="product-sort">
              Sort products
            </label>

            <select
              id="product-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
            >
              <option value="featured">Featured first</option>
              <option value="price_low">Price: low to high</option>
              <option value="price_high">Price: high to low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => selectCategory(category.value)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                activeCategory === category.value
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Product count */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-muted)]">
            {loading
              ? 'Loading products...'
              : `${filteredProducts.length} products found`}
          </p>

          {activeCategory && (
            <button
              type="button"
              onClick={() => selectCategory('')}
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Clear category
            </button>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">
              We couldn't load the products.
            </p>

            <p className="mt-1 text-sm">{error}</p>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="aspect-[4/3] animate-pulse bg-[var(--color-surface-soft)]" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--color-surface-soft)]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-soft)]" />
                </div>
              </div>
            ))}
          </div>
        ) : !error && filteredProducts.length === 0 ? (
          /* Empty state */
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] px-5 py-16 text-center">
            <p className="text-lg font-bold text-[var(--color-heading)]">
              No matching products
            </p>

            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Try another search term or choose a different division.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('');
                selectCategory('');
              }}
              className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Product grid */
          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const id = product.id || product._id;

              const image =
                product.imageUrl || product.image || product.thumbnail;

              const slug = product.slug || id;

              return (
                <article
                  key={id}
                  className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    to={`/products/${slug}`}
                    className="block"
                    aria-label={`View ${product.name || 'product'}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-soft)]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || 'Print product'}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
                          Product image unavailable
                        </div>
                      )}

                      {product.isFeatured && (
                        <span className="absolute left-3 top-3 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-bold text-white">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                        {product.categoryName ||
                          product.category ||
                          'Print product'}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-base font-bold text-[var(--color-heading)]">
                        {product.name || 'Untitled product'}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                        {product.shortDescription ||
                          product.description ||
                          ''}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between gap-3 px-4 pb-4">
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">
                        Starting from
                      </p>

                      <p className="mt-0.5 font-extrabold text-[var(--color-heading)]">
                        {formatMoney(
                          product.startingPrice ??
                            product.basePrice ??
                            product.price,
                          product.currency || 'INR'
                        )}
                      </p>
                    </div>

                    {onAddToCart && (
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-xs font-bold text-white hover:bg-[var(--color-primary-dark)]"
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
      </section>
    </main>
  );
};

export default Products;
