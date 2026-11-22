
import React from 'react';

function formatDate(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function ProofVersionList({
  versions = [],
  activeVersionId,
  onSelectVersion,
  loading = false,
}) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-[#eeeae3]" />
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-xl bg-[#eeeae3]" />
          ))}
        </div>
      </section>
    );
  }

  const sortedVersions = [...versions].sort(
    (a, b) => Number(b.version || 0) - Number(a.version || 0)
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
      <div className="border-b border-[var(--color-border)] p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-[var(--color-heading)]">
            Proof history
          </h3>
          <span className="rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--color-muted)]">
            {versions.length} versions
          </span>
        </div>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Review previous artwork submissions.
        </p>
      </div>

      {sortedVersions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-semibold text-[var(--color-heading)]">
            No versions yet
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            New proof versions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2 p-3">
          {sortedVersions.map((version) => {
            const id = version.id || version._id;
            const active = id === activeVersionId;
            const status = version.status || 'pending';

            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectVersion?.(version)}
                aria-pressed={active}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  active
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[var(--color-heading)]">
                    Version {version.version ?? '—'}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase ${
                    status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700'
                      : status === 'changes_requested' || status === 'rejected'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}>
                    {status.replaceAll('_', ' ')}
                  </span>
                </div>

                <p className="mt-2 text-[10px] text-[var(--color-muted)]">
                  {formatDate(version.createdAt)}
                </p>

                {version.revisionNote && (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--color-text)]">
                    {version.revisionNote}
                  </p>
                )}

                {active && (
                  <p className="mt-2 text-[10px] font-bold text-[var(--color-primary-dark)]">
                    Currently viewing
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
