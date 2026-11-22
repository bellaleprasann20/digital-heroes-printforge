
import React from 'react';

const formatDate = (date) => {
  if (!date) return 'No due date';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'No due date';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
};

const ProductionJobCard = ({
  job,
  onView,
  className = '',
}) => {
  if (!job) return null;

  const id = job.id || job._id;
  const orderNumber = job.orderNumber || job.order?.orderNumber || id || '—';
  const title = job.productName || job.product?.name || job.title || 'Print job';
  const customer = job.customerName || job.customer?.fullName || job.customer?.name || 'Customer';
  const dueDate = job.dueDate || job.expectedCompletionDate;

  const isOverdue =
    dueDate &&
    !['completed', 'cancelled'].includes(String(job.status).toLowerCase()) &&
    new Date(dueDate).getTime() < Date.now();

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(id));
    event.dataTransfer.setData(
      'application/printforge-job',
      JSON.stringify({
        id,
        _id: job._id,
        status: job.status,
        orderNumber: job.orderNumber,
      })
    );
  };

  return (
    <article
      draggable={Boolean(id)}
      onDragStart={handleDragStart}
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-[var(--color-primary)]">
          #{orderNumber}
        </span>

        {job.priority && (
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
            String(job.priority).toLowerCase() === 'high'
              ? 'bg-red-100 text-red-700'
              : 'bg-[var(--color-surface-soft)] text-[var(--color-muted)]'
          }`}>
            {job.priority}
          </span>
        )}
      </div>

      <h4 className="mt-3 line-clamp-2 text-sm font-bold text-[var(--color-heading)]">
        {title}
      </h4>

      <p className="mt-1 truncate text-xs text-[var(--color-muted)]">
        {customer}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.quantity != null && (
          <span className="rounded-lg bg-[var(--color-surface-soft)] px-2.5 py-1.5 text-xs text-[var(--color-text)]">
            Qty: {job.quantity}
          </span>
        )}

        {job.division && (
          <span className="rounded-lg bg-[var(--color-surface-soft)] px-2.5 py-1.5 text-xs text-[var(--color-text)]">
            {job.division}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
        <span className={`text-xs font-semibold ${isOverdue ? 'text-red-600' : 'text-[var(--color-muted)]'}`}>
          {isOverdue ? 'Overdue · ' : 'Due · '}
          {formatDate(dueDate)}
        </span>

        {onView && (
          <button
            type="button"
            onClick={() => onView(job)}
            className="text-xs font-bold text-[var(--color-primary)] hover:underline"
          >
            Details →
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductionJobCard;
