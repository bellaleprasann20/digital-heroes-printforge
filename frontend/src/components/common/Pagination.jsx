
import React, { useMemo } from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  className = '',
}) {
  const pages = useMemo(() => {
    const total = Math.max(1, Number(totalPages) || 1);
    const current = Math.min(Math.max(1, Number(currentPage) || 1), total);
    const visibleCount = siblingCount * 2 + 5;

    if (total <= visibleCount) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const left = Math.max(2, current - siblingCount);
    const right = Math.min(total - 1, current + siblingCount);

    const showLeftDots = left > 2;
    const showRightDots = right < total - 1;

    if (!showLeftDots && showRightDots) {
      const count = 3 + siblingCount * 2;
      return [
        ...Array.from({ length: count }, (_, index) => index + 1),
        '...',
        total,
      ];
    }

    if (showLeftDots && !showRightDots) {
      const count = 3 + siblingCount * 2;
      return [
        1,
        '...',
        ...Array.from(
          { length: count },
          (_, index) => total - count + index + 1
        ),
      ];
    }

    return [
      1,
      '...',
      ...Array.from(
        { length: right - left + 1 },
        (_, index) => left + index
      ),
      '...',
      total,
    ];
  }, [currentPage, totalPages, siblingCount]);

  const total = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(Math.max(1, Number(currentPage) || 1), total);

  if (total <= 1) return null;

  const buttonBase =
    'flex h-9 min-w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors';

  const inactive =
    'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]';

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange?.(current - 1)}
        disabled={current === 1}
        aria-label="Go to previous page"
        className={`${buttonBase} ${inactive} px-3 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <span aria-hidden="true">←</span>
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-9 min-w-7 items-center justify-center text-sm text-[var(--color-muted)]"
            aria-hidden="true"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange?.(page)}
            aria-label={`Go to page ${page}`}
            aria-current={current === page ? 'page' : undefined}
            className={[
              buttonBase,
              current === page
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                : inactive,
            ].join(' ')}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange?.(current + 1)}
        disabled={current === total}
        aria-label="Go to next page"
        className={`${buttonBase} ${inactive} px-3 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
