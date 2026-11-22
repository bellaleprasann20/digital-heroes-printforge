
import React, { useState } from 'react';

export default function ApprovalActions({
  proof,
  onApprove,
  onRequestChanges,
  submitting = false,
  disabled = false,
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');

  if (!proof) return null;

  const status = proof.status;
  const canReview = status === 'pending' || status === 'changes_requested';

  const handleApprove = async () => {
    if (!canReview || disabled || submitting) return;

    setError('');

    try {
      await onApprove?.(proof);
      setShowConfirmation(false);
    } catch (err) {
      setError(err.message || 'Approval could not be completed. Please try again.');
    }
  };

  if (status === 'approved') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            ✓
          </span>
          <h3 className="font-bold text-emerald-800">
            Proof approved
          </h3>
        </div>
        <p className="mt-2 text-sm leading-5 text-emerald-700">
          This proof has been approved. The production workflow can proceed after the server verifies the approval.
        </p>
      </div>
    );
  }

  if (status === 'superseded' || status === 'rejected') {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
        <p className="text-sm font-semibold text-[var(--color-heading)]">
          This proof can no longer be reviewed.
        </p>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Please review the latest active version.
        </p>
      </div>
    );
  }

  if (!canReview) return null;

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h3 className="font-bold text-[var(--color-heading)]">
        Review your artwork
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        Carefully check spelling, dimensions, colors and layout before approving this version.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">
          {error}
        </p>
      )}

      {showConfirmation ? (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="font-bold text-emerald-900">
            Confirm artwork approval
          </h4>
          <p className="mt-2 text-xs leading-5 text-emerald-800">
            You are approving version {proof.version ?? '—'}. Check that this is the exact artwork you want printed. Changes after approval may require a new revision.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApprove}
              disabled={submitting || disabled}
              className="rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm approval'}
            </button>

            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              disabled={submitting}
              className="rounded-lg border border-emerald-300 px-4 py-2.5 text-xs font-bold text-emerald-900 disabled:opacity-50"
            >
              Go back
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setShowConfirmation(true)}
            disabled={disabled || submitting}
            className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
          >
            ✓ Approve artwork
          </button>

          <button
            type="button"
            onClick={() => onRequestChanges?.(proof)}
            disabled={disabled || submitting}
            className="rounded-lg border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            Request changes
          </button>
        </div>
      )}

      <p className="mt-4 text-[10px] leading-5 text-[var(--color-muted)]">
        Approval applies only to the selected proof version.
      </p>
    </section>
  );
}
