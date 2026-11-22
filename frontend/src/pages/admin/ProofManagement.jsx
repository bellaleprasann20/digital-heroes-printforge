import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProofManagement({
  proofs = [],
  loading = false,
  error = '',
  onView,
  onRetry,
}) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => proofs.filter((proof) => {
    const query = search.trim().toLowerCase();
    const searchable = [
      proof.orderNumber,
      proof.customerName,
      proof.customer?.name,
      proof.productName,
    ].map((value) => String(value || '').toLowerCase());

    return (!query || searchable.some((value) => value.includes(query))) &&
      (status === 'all' || String(proof.status || '').toLowerCase() === status);
  }), [proofs, search, status]);

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-800">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm font-bold text-red-800 underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Artwork workflow</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Proof management</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Track proof versions, customer feedback, and approval status.</p>
      </header>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer or product..." className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]" />
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-sm">
            <option value="all">All proof statuses</option>
            {['pending', 'approved', 'changes_requested', 'rejected', 'superseded'].map((item) => (
              <option key={item} value={item}>{item.replaceAll('_', ' ')}</option>
            ))}
          </select>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <h2 className="font-bold text-[var(--color-heading)]">No proofs found</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">There are no proof records matching these filters.</p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[var(--color-background)] text-xs text-[var(--color-muted)]">
                <tr>
                  <th className="px-5 py-4">Order / Product</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Version</th>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Review</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((proof) => {
                  const id = proof.id || proof._id;
                  return (
                    <tr key={id} className="border-t border-[var(--color-border)]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[var(--color-heading)]">{proof.orderNumber || 'Order'}</p>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">{proof.productName || 'Artwork proof'}</p>
                      </td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">{proof.customerName || proof.customer?.name || '—'}</td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">v{proof.version || 1}</td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">{proof.createdAt ? new Date(proof.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-muted)]">
                          {String(proof.status || 'pending').replaceAll('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => onView?.(proof)} className="rounded-lg bg-[#bd6540] px-4 py-2 text-xs font-bold text-white">
                          View proof
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <p className="text-xs leading-5 text-[var(--color-muted)]">
        Only the server should record proof approvals and revisions. A proof approval must be tied to its exact version and customer before print-ready production files can be released.
      </p>
    </div>
  );
}