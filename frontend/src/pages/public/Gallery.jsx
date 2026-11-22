
import React, { useMemo, useState } from 'react';

const getImageUrl = (image) => {
  if (typeof image === 'string') return image;

  if (image && typeof image === 'object') {
    return (
      image.imageUrl ||
      image.image_url ||
      image.url ||
      image.src ||
      image.image ||
      ''
    );
  }

  return '';
};

const Gallery = ({
  items = [],
  loading = false,
  error = null,
  onRetry,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  // Convert actual product records into gallery images.
  const galleryItems = useMemo(() => {
    return items.flatMap((product) => {
      const category =
        product.categoryName ||
        product.category ||
        product.division ||
        'Print project';

      const additionalImages = Array.isArray(product.gallery_images)
        ? product.gallery_images
        : [];

      const images = [
        product.imageUrl || product.image_url || '',
        ...additionalImages.map(getImageUrl),
      ].filter(Boolean);

      // Remove duplicate image URLs.
      const uniqueImages = [...new Set(images)];

      return uniqueImages.map((image, index) => ({
        id: `${product.id || product.slug || product.name}-${index}`,
        imageUrl: image,
        title: product.name || product.title || 'Print project',
        category,
        categoryName: category,
        description: product.description || '',
        productId: product.id,
        slug: product.slug,
      }));
    });
  }, [items]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        galleryItems
          .map((item) => item.categoryName || item.category)
          .filter(Boolean)
      ),
    ];

    return ['All', ...unique];
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return galleryItems;

    return galleryItems.filter(
      (item) =>
        (item.categoryName || item.category) === activeCategory
    );
  }, [galleryItems, activeCategory]);

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      {/* PAGE HEADER */}

      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow">Made at PrintForge</p>

          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-5xl">
            Work worth looking at.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
            Explore finished print work and discover the possibilities across
            our specialist product divisions.
          </p>
        </div>
      </section>

      {/* GALLERY */}

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:py-14">

        {/* CATEGORY FILTERS */}

        {!loading && !error && galleryItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  activeCategory === category
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
            <p className="font-semibold">
              Unable to load the gallery.
            </p>

            <p className="mt-1 text-sm">
              {error}
            </p>

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

        {/* LOADING */}

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-[var(--color-surface-soft)]"
              />
            ))}
          </div>
        ) : !error && filteredItems.length === 0 ? (

          /* EMPTY STATE */

          <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] px-5 py-16 text-center">
            <h2 className="text-lg font-bold text-[var(--color-heading)]">
              No gallery images available
            </h2>

            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Products with published images will appear here.
            </p>
          </div>

        ) : !error && (

          /* GALLERY GRID */

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-left transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[var(--color-surface-soft)]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                    {item.categoryName}
                  </p>

                  <h2 className="mt-2 font-bold text-[var(--color-heading)]">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* IMAGE PREVIEW MODAL */}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-[var(--color-surface)]">

            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Close image preview"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-xl text-white"
            >
              ×
            </button>

            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              className="max-h-[70vh] w-full bg-black object-contain"
            />

            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                {selectedItem.categoryName}
              </p>

              <h2 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
                {selectedItem.title}
              </h2>

              {selectedItem.description && (
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                  {selectedItem.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gallery;
