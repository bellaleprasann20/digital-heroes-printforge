import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-IN');
};

export default function ProductionDetails({
  job = null,
  loading = false,
  error = '',
  onUpdateStage,
  onDownloadFile,
  onRetry,
}) {
  const { jobId } = useParams();
  const [nextStage, setNextStage] = useState(job?.stage || job?.status || 'artwork');
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const updateJob = async () => {
    if (!onUpdateStage || !job) {
      setActionError('Production update service is not connected.');
      return;
    }

    if (nextStage === 'production' && job.proofApproved !== true) {
      setActionError('Customer approval is required before production.');
      return;
    }

    if (nextStage === 'production' && job.readyForProduction === false) {
      setActionError('This job is not marked ready for production.');
      return;
    }

    setSubmitting(true);
    setActionError('');

    try {
      await onUpdateStage(job, nextStage);
    } catch (err) {
      setActionError(err?.message || 'Unable to update production stage.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  if (error || !job) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-800">{error || `Production job ${jobId || ''} was not found.`}</p>
        <button onClick={onRetry} className="mt-3 text-sm font-bold text-red-800 underline">Try again</button>
        <div><Link to="/admin/production" className="mt-4 inline-block text-sm font-semibold text-red-800">← Back to queue</Link></div>
      </div>
    );
  }

  const files = Array.isArray(job.productionFiles) ? job.productionFiles : [];

  return (
    <div className="space-y-6">
      <header>
        <Link to="/admin/production" className="text-sm font-semibold text-[#b85f39] hover:underline">← Production queue</Link>
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Production job</p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">{job.orderNumber || job.id || job._id}</h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{job.productName || 'Print job'}</p>
          </div>
          <span className="w-fit rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold capitalize text-[var(--color-muted)]">{job.stage || job.status || 'Pending'}</span>
        </div>
      </header>

      {actionError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{actionError}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 className="font-bold text-[var(--color-heading)]">Job information</h2>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              {[
                ['Customer', job.customerName || job.customer?.name],
                ['Email', job.customerEmail || job.customer?.email],
                ['Product', job.productName],
                ['Quantity', job.quantity],
                ['Material', job.material],
                ['Dimensions', job.dimensions],
                ['Created', formatDate(job.createdAt)],
                ['Last updated', formatDate(job.updatedAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
                  <dd className="mt-1 break-words text-sm font-semibold text-[var(--color-heading)]">{value ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 className="font-bold text-[var(--color-heading)]">Production readiness</h2>
            <div className="mt-5 space-y-3">
              {[
                ['Artwork available', Boolean(job.artworkAvailable)],
                ['Proof approved', job.proofApproved === true],
                ['Production files generated', files.length > 0],
                ['Ready for production', job.readyForProduction === true],
              ].map(([label, ready]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-xl bg-[var(--color-background)] p-3">
                  <span className="text-sm text-[var(--color-heading)]">{label}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${ready ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ready ? 'Complete' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-[var(--color-muted)]">
              The backend must independently validate approval and readiness before allowing production or releasing print-ready files.
            </p>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 className="font-bold text-[var(--color-heading)]">Production files</h2>
            {files.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--color-muted)]">No production files are available for this job.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {files.map((file, index) => (
                  <div key={file.id || file._id || file.name || index} className="flex flex-col justify-between gap-3 rounded-xl border border-[var(--color-border)] p-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="break-all text-sm font-semibold text-[var(--color-heading)]">{file.name || file.fileName || 'Production file'}</p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">{file.type || file.format || 'File'} · {file.sizeLabel || 'Size unavailable'}</p>
                    </div>
                    <button
                      type="button"
                      disabled={!onDownloadFile}
                      onClick={() => onDownloadFile(file, job)}
                      className="rounded-lg bg-[#bd6540] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="font-bold text-[var(--color-heading)]">Update job stage</h2>
            <label className="mt-5 block text-sm font-semibold text-[var(--color-heading)]">
              New stage
              <select value={nextStage} onChange={(event) => setNextStage(event.target.value)} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 font-normal">
                {['quote', 'order', 'artwork', 'proof', 'production', 'completed', 'cancelled'].map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={updateJob}
              disabled={submitting || !onUpdateStage}
              className="mt-4 w-full rounded-xl bg-[#bd6540] px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update production stage'}
            </button>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="font-bold text-[var(--color-heading)]">Production notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[var(--color-muted)]">{job.productionNotes || 'No production notes have been recorded.'}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}