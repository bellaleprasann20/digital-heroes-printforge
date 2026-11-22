
import React, { useRef, useState } from 'react';

const MAX_REFERENCE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function RevisionRequest({
  proof,
  onSubmit,
  onCancel,
  submitting = false,
  maxLength = 2000,
}) {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [referenceFile, setReferenceFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please attach a PNG, JPG or WebP image.');
      return;
    }

    if (file.size > MAX_REFERENCE_SIZE) {
      setError('Reference image must be 5 MB or smaller.');
      return;
    }

    setError('');
    setReferenceFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!proof) {
      setError('No proof selected.');
      return;
    }

    if (message.trim().length < 5) {
      setError('Please describe the changes you need (at least 5 characters).');
      return;
    }

    if (message.length > maxLength) {
      setError(`Your message must be ${maxLength} characters or fewer.`);
      return;
    }

    setError('');

    try {
      await onSubmit?.({
        proofId: proof.id || proof._id,
        version: proof.version,
        message: message.trim(),
        referenceFile,
      });
    } catch (err) {
      setError(err.message || 'Unable to submit your revision request.');
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
          Artwork revision
        </p>
        <h3 className="mt-1 text-lg font-extrabold text-[var(--color-heading)]">
          Request changes
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Describe exactly what needs to be changed so the production team can prepare the next proof.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="revision-message"
            className="mb-2 block text-xs font-bold text-[var(--color-heading)]"
          >
            Changes required
          </label>
          <textarea
            id="revision-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            maxLength={maxLength}
            placeholder="Example: Please correct the text, adjust the logo position and use the updated brand color..."
            disabled={submitting}
            className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 text-sm leading-6 text-[var(--color-heading)] outline-none transition focus:border-[var(--color-primary)] disabled:opacity-50"
          />
          <div className="mt-2 flex justify-between gap-3">
            <span className="text-[10px] text-[var(--color-muted)]">
              Be specific about text, color, size or placement.
            </span>
            <span className="shrink-0 text-[10px] tabular-nums text-[var(--color-muted)]">
              {message.length}/{maxLength}
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[var(--color-heading)]">
            Reference image (optional)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={submitting}
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] px-4 py-3 text-xs font-bold text-[var(--color-text)] transition hover:border-[var(--color-primary)] disabled:opacity-50"
          >
            + Attach reference image
          </button>

          {referenceFile && (
            <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[var(--color-background)] p-3">
              <span className="min-w-0 truncate text-xs font-semibold text-[var(--color-heading)]">
                {referenceFile.name}
              </span>
              <button
                type="button"
                onClick={() => setReferenceFile(null)}
                disabled={submitting}
                className="shrink-0 text-xs font-bold text-red-600"
              >
                Remove
              </button>
            </div>
          )}

          <p className="mt-2 text-[10px] text-[var(--color-muted)]">
            PNG, JPG or WebP · Maximum 5 MB
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || message.trim().length < 5}
            className="flex-1 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Submitting request...' : 'Submit revision request'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="rounded-lg border border-[var(--color-border)] px-5 py-3 text-sm font-bold text-[var(--color-text)] hover:bg-[var(--color-background)] disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
