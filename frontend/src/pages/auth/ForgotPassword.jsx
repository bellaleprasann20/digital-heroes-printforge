import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword({
  onResetRequest,
  loading = false,
  error = '',
}) {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (typeof onResetRequest !== 'function') {
      setValidationError('Password reset service is not connected yet.');
      return;
    }

    setValidationError('');

    try {
      await onResetRequest(normalizedEmail);
      setSubmitted(true);
    } catch (err) {
      setValidationError(
        err?.message || 'Unable to send the reset email. Please try again.'
      );
    }
  };

  const message = validationError || error;

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[var(--color-background)] px-4 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-xl sm:p-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-heading)]">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#c66b43] text-white">
            P
          </span>
          PrintForge
        </Link>

        <div className="mt-10">
          <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[#c66b43]/10 text-2xl text-[#b85f39]">
            ↗
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c66b43]">
            Account recovery
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-heading)]">
            Forgot your password?
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Enter the email address linked to your account. If it is
            registered, we'll send instructions to reset your password.
          </p>
        </div>

        {submitted ? (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
          >
            <p className="font-semibold text-emerald-800">
              Check your inbox
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-700">
              If an account exists for {email.trim()}, a password reset
              link has been requested. Check your inbox and spam folder.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-bold text-emerald-800 underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="reset-email"
                className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
              >
                Email address
              </label>
              <input
                id="reset-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setValidationError('');
                }}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3.5 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
              />
            </div>

            {message && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#bd6540] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#a95432] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending instructions...' : 'Send reset instructions'}
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-[var(--color-border)] pt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-bold text-[#b85f39] hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>
      </section>
    </main>
  );
}