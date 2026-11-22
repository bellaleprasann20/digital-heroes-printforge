
import React from 'react';
import { Link } from 'react-router-dom';

const proofStatus = {
  pending: {
    label: 'Awaiting your approval',
    style: 'bg-amber-100 text-amber-800',
  },
  changes_requested: {
    label: 'Changes requested',
    style: 'bg-orange-100 text-orange-800',
  },
  approved: {
    label: 'Approved',
    style: 'bg-emerald-100 text-emerald-800',
  },
  rejected: {
    label: 'Rejected',
    style: 'bg-red-100 text-red-800',
  },
};

const ActiveProofCard = ({
  proof,
  onReview,
  className = '',
}) => {
  if (!proof) return null;

  const id = proof.id || proof._id;
  const status = String(proof.status || 'pending').toLowerCase();
  const config = proofStatus[status] || proofStatus.pending;
  const preview = proof.previewUrl || proof.fileUrl;

  const date = proof.createdAt
    ? new Date(proof.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Date unavailable';

  return (
    <article className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            Proof review
          </p>
          <h3 className="mt-1 font-bold text-[var(--color-heading)]">
            {proof.productName || proof.order?.productName || 'Artwork proof'}
          </h3>
        </div>

        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${config.style}`}>
          {config.label}
        </span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr]">
        <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[var(--color-surface-soft)]">
          {preview ? (
            <img
              src={preview}
              alt="Artwork proof preview"
              loading="lazy"
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-[var(--color-muted)]">
              Preview unavailable
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-sm text-[var(--color-muted)]">
            Order: <span className="font-semibold text-[var(--color-heading)]">
              {proof.orderNumber || proof.order?.orderNumber || '—'}
            </span>
          </p>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Proof version: <span className="font-semibold text-[var(--color-heading)]">
              v{proof.version || 1}
            </span>
          </p>

          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Submitted: {date}
          </p>

          {proof.revisionNote && (
            <p className="mt-3 rounded-lg bg-[var(--color-surface-soft)] p-3 text-sm text-[var(--color-text)]">
              {proof.revisionNote}
            </p>
          )}

          <div className="mt-4">
            {onReview ? (
              <button
                type="button"
                onClick={() => onReview(proof)}
                className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Review proof
              </button>
            ) : (
              <Link
                to={`/account/proofs/${id}`}
                className="inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
              >
                Review proof
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ActiveProofCard;
