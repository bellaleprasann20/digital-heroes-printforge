
import React, { useState } from 'react';

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-emerald-50 text-emerald-700',
    changes_requested: 'bg-red-50 text-red-700',
    rejected: 'bg-red-50 text-red-700',
    superseded: 'bg-gray-100 text-gray-600',
  };

  const labels = {
    pending: 'Awaiting review',
    approved: 'Approved',
    changes_requested: 'Changes requested',
    rejected: 'Rejected',
    superseded: 'Superseded',
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status || 'Unknown'}
    </span>
  );
}

export default function ProofPreview({
  proof,
  loading = false,
  error = null,
  onDownload,
}) {
  const [zoomed, setZoomed] = useState(false);

  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="h-5 w-40 rounded bg-[#eeeae3]" />
        <div className="mt-5 aspect-[4/3] rounded-xl bg-[#eeeae3]" />
        <div className="mt-5 h-4 w-3/4 rounded bg-[#eeeae3]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <h3 className="font-bold text-[var(--color-heading)]">
          Unable to load proof
        </h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!proof) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-12 text-center">
        <div className="text-4xl text-[var(--color-muted)]">◇</div>
        <h3 className="mt-3 font-bold text-[var(--color-heading)]">
          No proof available yet
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Your artwork proof will appear here once it is ready for review.
        </p>
      </div>
    );
  }

  const fileUrl = proof.previewUrl || proof.fileUrl;
  const isPdf = proof.fileType === 'pdf' ||
    fileUrl?.toLowerCase().split('?')[0].endsWith('.pdf');

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
            Artwork proof
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-[var(--color-heading)]">
            {proof.title || 'Design proof'}
          </h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Version {proof.version ?? '—'}
          </p>
        </div>

        <StatusBadge status={proof.status} />
      </div>

      <div className="bg-[#f0eee9] p-4 sm:p-8">
        {fileUrl ? (
          <div className="mx-auto flex min-h-64 max-w-3xl items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
            {isPdf ? (
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=0`}
                title={`Proof version ${proof.version ?? ''}`}
                className="h-[65vh] min-h-96 w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setZoomed(!zoomed)}
                className="block w-full cursor-zoom-in"
                aria-label="Toggle proof image size"
              >
                <img
                  src={fileUrl}
                  alt={proof.title || 'Artwork proof'}
                  className={`mx-auto max-h-[65vh] w-auto max-w-full object-contain transition-transform duration-300 ${zoomed ? 'scale-110' : 'scale-100'}`}
                />
              </button>
            )}
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm text-gray-500">
            Proof preview is not available.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="text-xs font-semibold text-[var(--color-heading)]">
            {proof.productName || 'Custom print artwork'}
          </p>
          <p className="mt-1 text-[10px] text-[var(--color-muted)]">
            {proof.createdAt
              ? `Created ${new Date(proof.createdAt).toLocaleString('en-IN')}`
              : 'Creation date unavailable'}
          </p>
        </div>

        {fileUrl && onDownload && (
          <button
            type="button"
            onClick={() => onDownload(proof)}
            className="rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-xs font-bold text-[var(--color-heading)] transition hover:border-[var(--color-primary)]"
          >
            ↓ Download proof
          </button>
        )}
      </div>
    </section>
  );
}
