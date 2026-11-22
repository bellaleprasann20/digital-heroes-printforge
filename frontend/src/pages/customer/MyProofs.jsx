import { useState } from 'react';
import { Link } from 'react-router-dom';

import ProofPreview from '../../components/proofs/ProofPreview';
import ProofVersionList from '../../components/proofs/ProofVersionList';
import ApprovalActions from '../../components/proofs/ApprovalActions';
import RevisionRequest from '../../components/proofs/RevisionRequest';

export default function MyProofs({
  proofs = [],
  loading = false,
  error = '',
  onApprove,
  onRequestChanges,
  onRetry,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');

  const selectedProof =
    proofs.find((proof) => (proof.id || proof._id) === selectedId) ||
    proofs[0] ||
    null;

  const selectedOrderProofs = selectedProof
    ? proofs.filter(
        (proof) =>
          (proof.orderId || proof.order?._id || proof.order?.id) ===
          (selectedProof.orderId ||
            selectedProof.order?._id ||
            selectedProof.order?.id)
      )
    : [];

  const handleApprove = async (proof) => {
    if (typeof onApprove !== 'function') {
      setActionError('Proof approval service is not connected yet.');
      return;
    }

    setSubmitting(true);
    setActionError('');

    try {
      await onApprove(proof);
    } catch (err) {
      setActionError(err?.message || 'Unable to approve this proof.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevision = async (payload) => {
    if (typeof onRequestChanges !== 'function') {
      throw new Error('Revision request service is not connected yet.');
    }

    setSubmitting(true);
    setActionError('');

    try {
      await onRequestChanges(payload);
      setShowRevisionForm(false);
    } catch (err) {
      setActionError(err?.message || 'Unable to submit your revision request.');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-semibold text-red-800">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-bold text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
          Artwork review
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
          My proofs
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Review artwork carefully before it moves into production.
        </p>
      </header>

      {proofs.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-16 text-center">
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            No proofs available
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Proofs will appear here when artwork is ready for your review.
          </p>
          <Link
            to="/account/orders"
            className="mt-5 inline-block text-sm font-bold text-[#b85f39]"
          >
            View orders →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            {selectedProof && (
              <>
                <ProofPreview proof={selectedProof} />

                <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                  <h2 className="font-bold text-[var(--color-heading)]">
                    Review this version
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    Check text, dimensions, colours, placement, and spelling.
                    Approve only when the artwork is correct.
                  </p>

                  {actionError && (
                    <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      {actionError}
                    </p>
                  )}

                  {showRevisionForm ? (
                    <div className="mt-5">
                      <RevisionRequest
                        proof={selectedProof}
                        onSubmit={handleRevision}
                        onCancel={() => setShowRevisionForm(false)}
                        submitting={submitting}
                      />
                    </div>
                  ) : (
                    <div className="mt-5">
                      <ApprovalActions
                        proof={selectedProof}
                        onApprove={handleApprove}
                        onRequestChanges={() => setShowRevisionForm(true)}
                        submitting={submitting}
                      />
                    </div>
                  )}
                </section>
              </>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h2 className="mb-4 font-bold text-[var(--color-heading)]">
                Available proofs
              </h2>
              <div className="space-y-2">
                {proofs.map((proof) => {
                  const id = proof.id || proof._id;
                  const active =
                    id === (selectedProof?.id || selectedProof?._id);

                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => {
                        setSelectedId(id);
                        setShowRevisionForm(false);
                        setActionError('');
                      }}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        active
                          ? 'border-[#c66b43] bg-[#c66b43]/5'
                          : 'border-[var(--color-border)] hover:border-[#c66b43]'
                      }`}
                    >
                      <span className="block text-sm font-bold text-[var(--color-heading)]">
                        {proof.orderNumber || proof.productName || 'Artwork proof'}
                      </span>
                      <span className="mt-1 block text-xs text-[var(--color-muted)]">
                        Version {proof.version || 1} · {proof.status || 'Pending'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {selectedProof && (
              <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h2 className="mb-4 font-bold text-[var(--color-heading)]">
                  Version history
                </h2>
                <ProofVersionList
                  versions={selectedOrderProofs.length ? selectedOrderProofs : [selectedProof]}
                  activeVersionId={selectedProof.id || selectedProof._id}
                  onSelectVersion={(version) =>
                    setSelectedId(version.id || version._id)
                  }
                />
              </section>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}