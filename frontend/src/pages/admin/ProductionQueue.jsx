import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const stages = ['artwork', 'proof', 'production', 'completed'];

export default function ProductionQueue({
  jobs = [],
  loading = false,
  error = '',
  onUpdateStage,
  onRetry,
}) {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    const searchable = [
      job.orderNumber,
      job.productName,
      job.customerName,
      job.customer?.name,
    ].map((value) => String(value || '').toLowerCase());

    return (!query || searchable.some((value) => value.includes(query))) &&
      (stage === 'all' || String(job.stage || job.status || '').toLowerCase() === stage);
  }), [jobs, search, stage]);

  const updateStage = async (job, nextStage) => {
    if (!onUpdateStage) return;
    const id = job.id || job._id;
    setBusyId(id);
    try {
      await onUpdateStage(job, nextStage);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-800">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm font-bold text-red-800 underline">Try again</button>
      </div>
    );
  }

  const grouped = stages.map((name) => ({
    name,
    items: filtered.filter((job) => String(job.stage || job.status || '').toLowerCase() === name),
  }));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Production operations</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Production queue</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Move approved jobs through the production pipeline.</p>
      </header>

      <section className="grid gap-3 md:grid-cols-[1fr_220px]">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, product or customer..." className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]" />
        <select value={stage} onChange={(event) => setStage(event.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm">
          <option value="all">All stages</option>
          {stages.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </section>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-4">
        {grouped.map((group) => (
          <section key={group.name} className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold capitalize text-[var(--color-heading)]">{group.name}</h2>
              <span className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs font-bold text-[var(--color-muted)]">{group.items.length}</span>
            </div>

            <div className="space-y-3">
              {group.items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-center text-xs text-[var(--color-muted)]">No jobs in this stage.</p>
              ) : group.items.map((job) => {
                const id = job.id || job._id;
                const currentIndex = stages.indexOf(group.name);
                const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];

                return (
                  <article key={id} className="rounded-xl border border-[var(--color-border)] p-4">
                    <p className="text-xs font-bold text-[#b85f39]">{job.orderNumber || `Job ${id}`}</p>
                    <h3 className="mt-2 font-semibold text-[var(--color-heading)]">{job.productName || 'Print job'}</h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">{job.customerName || job.customer?.name || 'Customer not specified'}</p>
                    <p className="mt-2 text-xs text-[var(--color-muted)]">Quantity: {job.quantity ?? '—'}</p>
                    {job.readyForProduction === false && (
                      <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">Not yet marked ready for production</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link to={`/admin/production/${id}`} className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold">Details</Link>
                      {currentIndex < stages.length - 1 && (
                        <button
                          disabled={!onUpdateStage || busyId === id || (group.name === 'proof' && job.proofApproved !== true) || job.readyForProduction === false}
                          onClick={() => updateStage(job, nextStage)}
                          className="rounded-lg bg-[#bd6540] px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {busyId === id ? 'Updating...' : `Move to ${nextStage}`}
                        </button>
                      )}
                    </div>
                    {group.name === 'proof' && job.proofApproved !== true && (
                      <p className="mt-2 text-xs text-amber-700">Customer approval is required before production.</p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}