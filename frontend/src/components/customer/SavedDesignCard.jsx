
import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (date) => {
  if (!date) return 'Not available';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Not available';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const SavedDesignCard = ({
  design,
  onEdit,
  onDelete,
  onOrder,
  className = '',
}) => {
  if (!design) return null;

  const id = design.id || design._id;
  const image = design.previewUrl || design.thumbnailUrl || design.imageUrl;
  const title = design.name || design.title || 'Untitled design';

  return (
    <article className={`group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition hover:-translate-y-1 hover:shadow-lg ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-soft)]">
        {image ? (
          <img
            src={image}
            alt={`Preview of ${title}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-muted)]">
            No design preview
          </div>
        )}

        {design.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur">
            {design.category}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate font-bold text-[var(--color-heading)]">
          {title}
        </h3>

        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Last updated {formatDate(design.updatedAt || design.createdAt)}
        </p>

        {design.productName && (
          <p className="mt-2 text-sm text-[var(--color-text)]">
            Product: {design.productName}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(design)}
              className="rounded-lg bg-[var(--color-primary)] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              Edit design
            </button>
          ) : (
            <Link
              to={`/designer/${id}`}
              className="rounded-lg bg-[var(--color-primary)] px-3 py-2.5 text-center text-xs font-bold text-white"
            >
              Edit design
            </Link>
          )}

          {onOrder && (
            <button
              type="button"
              onClick={() => onOrder(design)}
              className="rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-xs font-bold text-[var(--color-heading)] hover:bg-[var(--color-surface-soft)]"
            >
              Order again
            </button>
          )}
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(design)}
            className="mt-3 w-full text-xs font-medium text-red-600 hover:underline"
          >
            Delete saved design
          </button>
        )}
      </div>
    </article>
  );
};

export default SavedDesignCard;
