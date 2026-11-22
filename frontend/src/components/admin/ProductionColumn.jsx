
import React, { useState } from 'react';
import ProductionJobCard from './ProductionJobCard';

const stageStyles = {
  gray: 'bg-gray-400',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
};

const ProductionColumn = ({
  stage,
  jobs = [],
  onDropJob,
  onViewJob,
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    const jobId = event.dataTransfer.getData('text/plain');
    const job = jobs.find((item) => String(item.id || item._id) === jobId);

    // The dragged job may belong to a different column.
    // The board supplies the job through the shared drag payload.
    const draggedJobData = event.dataTransfer.getData('application/printforge-job');

    if (draggedJobData) {
      try {
        const draggedJob = JSON.parse(draggedJobData);
        onDropJob?.(draggedJob, stage.id);
        return;
      } catch {
        // Ignore invalid drag data.
      }
    }

    if (job) {
      onDropJob?.(job, stage.id);
    }
  };

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOver(false);
        }
      }}
      onDrop={handleDrop}
      className={`flex min-h-[420px] flex-col rounded-2xl border p-3 transition ${
        isOver
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-[var(--color-border)] bg-[var(--color-surface-soft)]'
      }`}
    >
      <div className="mb-3 flex items-center justify-between px-1 py-2">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${stageStyles[stage?.color] || stageStyles.gray}`} />
          <h3 className="text-sm font-bold text-[var(--color-heading)]">
            {stage?.title || 'Stage'}
          </h3>
        </div>

        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--color-surface)] px-2 text-xs font-bold text-[var(--color-muted)]">
          {jobs.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {jobs.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] p-6 text-center text-xs text-[var(--color-muted)]">
            No jobs in this stage
          </div>
        ) : (
          jobs.map((job, index) => (
            <ProductionJobCard
              key={job.id || job._id || index}
              job={job}
              onView={onViewJob}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductionColumn;
