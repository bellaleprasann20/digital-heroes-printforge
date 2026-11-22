
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function WorkGallery({
  items = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    const names = [
      ...new Set(
        items.map((item) => item.categoryName || item.category).filter(Boolean)
      ),
    ];

    return ['All', ...names];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;

    return items.filter(
      (item) => (item.categoryName || item.category) === activeCategory
    );
  }, [items, activeCategory]);

  return (
    <section className="section overflow-hidden bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="section-heading mb-0 max-w-2xl">
            <span className="eyebrow">A little inspiration</span>
            <h2>
              Work that speaks
              <br />
              <span className="text-[var(--color-primary)]">for itself.</span>
            </h2>
            <p>
              Explore completed print work and discover what's possible
              for your next project.
            </p>
          </div>

          <Link
            to="/gallery"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-bold leading-none text-[var(--color-heading)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)] md:self-end"
          >
            View full gallery
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        {!loading && !error && items.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={[
                  'inline-flex min-h-10 items-center justify-center rounded-full border px-5 py-2 text-xs font-bold leading-none transition-all',
                  activeCategory === category
                    ? 'border-[var(--color-heading)] bg-[var(--color-heading)] text-white'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-dark)]',
                ].join(' ')}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="mt-10 rounded-2xl border border-[var(--color-border)] py-12">
            <div className="flex justify-center">
              <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-[var(--color-primary)] border-r-transparent" />
            </div>
            <p className="mt-3 text-center text-sm text-[var(--color-muted)]">
              Loading gallery...
            </p>
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-red-200 p-10 text-center">
            <p className="font-bold text-[var(--color-heading)]">
              Gallery couldn't be loaded.
            </p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg px-5 py-2 text-sm font-bold text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-primary-light)]"
              >
                Try again
              </button>
            )}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)] px-5 py-16 text-center">
            <span className="text-4xl text-[var(--color-muted)]" aria-hidden="true">
              ▧
            </span>
            <h3 className="mt-4 text-lg font-bold text-[var(--color-heading)]">
              Our gallery is being prepared
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-text)]">
              Completed projects will appear here as they are published.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-3">
            {filteredItems.slice(0, 6).map((item, index) => (
              <Link
                key={item.id || item._id || item.imageUrl || index}
                to={item.href || '/gallery'}
                className={[
                  'group relative min-w-0 overflow-hidden rounded-2xl bg-[var(--color-surface-soft)]',
                  index === 0 ? 'sm:row-span-2' : '',
                ].join(' ')}
              >
                {item.imageUrl || item.image ? (
                  <img
                    src={item.imageUrl || item.image}
                    alt={item.title || 'Digital Heroes print work'}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl text-[#b7afa3]">
                    ◇
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] leading-4 text-white/70">
                    {item.categoryName || item.category || 'Print project'}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-6 text-white">
                    {item.title || 'Explore our work'}
                  </h3>
                </div>

                <span className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-lg leading-none text-[var(--color-heading)] opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
