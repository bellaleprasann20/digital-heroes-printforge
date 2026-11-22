import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
};

export default function MyDesigns({
  designs = [],
  loading = false,
  error = '',
  onDelete,
  onRetry,
}) {
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filteredDesigns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return designs.filter((design) =>
      !query ||
      String(design.name || '').toLowerCase().includes(query) ||
      String(design.productName || '').toLowerCase().includes(query)
    );
  }, [designs, search]);

  const handleDelete = async (design) => {
    const id = design.id || design._id;
    if (!id || typeof onDelete !== 'function') return;

    if (!window.confirm(`Delete "${design.name || 'this design'}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);

    try {
      await onDelete(design);
    } catch {
      // The parent should expose the API error through its error state.
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
            Your creative workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
            My designs
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Access and continue working on your saved artwork.
          </p>
        </div>

        <Link
          to="/products"
          className="rounded-xl bg-[#bd6540] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#a95432]"
        >
          Start a new design →
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-muted)]">
          {designs.length} saved design{designs.length === 1 ? '' : 's'}
        </p>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your designs..."
          aria-label="Search saved designs"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[#c66b43] sm:max-w-xs"
        />
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-2xl bg-[var(--color-border)]" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-800">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-bold text-red-800 underline"
          >
            Try again
          </button>
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#c66b43]/10 text-2xl text-[#b85f39]">
            ◈
          </div>
          <h2 className="mt-5 text-lg font-bold text-[var(--color-heading)]">
            {designs.length ? 'No matching designs' : 'No saved designs yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--color-muted)]">
            {designs.length
              ? 'Try another search term.'
              : 'When you save artwork in the designer, it will be available here.'}
          </p>
          {!designs.length && (
            <Link
              to="/products"
              className="mt-5 inline-block text-sm font-bold text-[#b85f39]"
            >
              Explore products →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDesigns.map((design) => {
            const id = design.id || design._id;
            const preview = design.previewUrl || design.thumbnailUrl || design.imageUrl;

            return (
              <article
                key={id}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[var(--color-background)]">
                  {preview ? (
                    <img
                      src={preview}
                      alt={`${design.name || 'Saved design'} preview`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-4xl text-[var(--color-muted)]">▧</span>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
                    {design.status || 'Saved'}
                  </span>
                </div>

                <div className="p-5">
                  <h2 className="truncate font-bold text-[var(--color-heading)]">
                    {design.name || 'Untitled design'}
                  </h2>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {design.productName || design.categoryName || 'Print design'}
                  </p>
                  <p className="mt-3 text-xs text-[var(--color-muted)]">
                    Last updated: {formatDate(design.updatedAt || design.createdAt)}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <Link
                      to={`/account/designs/${id}/edit`}
                      className="flex-1 rounded-lg bg-[#bd6540] px-3 py-2.5 text-center text-xs font-bold text-white hover:bg-[#a95432]"
                    >
                      Continue editing
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(design)}
                      disabled={!onDelete || deletingId === id}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-xs font-semibold text-[var(--color-muted)] hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                    >
                      {deletingId === id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}