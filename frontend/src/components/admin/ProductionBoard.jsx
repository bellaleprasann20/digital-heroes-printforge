
import React, { useMemo } from 'react';
import ProductionColumn from './ProductionColumn';

export const PRODUCTION_STAGES = [
  { id: 'quote', title: 'Quote', color: 'gray' },
  { id: 'order', title: 'Order', color: 'blue' },
  { id: 'artwork', title: 'Artwork', color: 'indigo' },
  { id: 'proof', title: 'Proof', color: 'amber' },
  { id: 'production', title: 'Production', color: 'purple' },
  { id: 'completed', title: 'Completed', color: 'green' },
];

const ProductionBoard = ({
  jobs = [],
  loading = false,
  error = null,
  onMoveJob,
  onViewJob,
  onRetry,
  className = '',
}) => {
  const groupedJobs = useMemo(() => {
    const groups = Object.fromEntries(
      PRODUCTION_STAGES.map((stage) => [stage.id, []])
    );

    jobs.forEach((job) => {
      const status = String(job.status || 'quote').toLowerCase();

      if (groups[status]) {
        groups[status].push(job);
      }
    });

    return groups;
  }, [jobs]);

  if (loading) {
    return (
      <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 ${className}`}>
        {PRODUCTION_STAGES.map((stage) => (
          <div key={stage.id} className="min-h-72 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
            <div className="h-5 w-28 animate-pulse rounded bg-[var(--color-border)]" />
            <div className="mt-5 space-y-3">
              {[1, 2].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-xl bg-[var(--color-surface)]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl border border-red-200 bg-red-50 p-6 ${className}`}>
        <p className="font-semibold text-red-700">Unable to load production jobs</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  const handleDropJob = (job, nextStatus) => {
    if (!job || !onMoveJob) return;

    if (String(job.status).toLowerCase() === nextStatus) return;

    onMoveJob(job, nextStatus);
  };

  return (
    <section className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Production pipeline
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Track each job from initial quote to completion.
          </p>
        </div>

        <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)]">
          {jobs.length} total jobs
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PRODUCTION_STAGES.map((stage) => (
          <div key={stage.id} className="w-[290px] shrink-0 sm:w-[320px]">
            <ProductionColumn
              stage={stage}
              jobs={groupedJobs[stage.id]}
              onDropJob={handleDropJob}
              onViewJob={onViewJob}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductionBoard;
