import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword({
  onResetPassword,
  loading = false,
  error = '',
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setValidationError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      setValidationError('Your password must contain at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError('Your passwords do not match.');
      return;
    }

    if (typeof onResetPassword !== 'function') {
      setValidationError('Password update service is not connected yet.');
      return;
    }

    try {
      await onResetPassword(form.password);
      setSuccess(true);
    } catch (err) {
      setValidationError(
        err?.message || 'Unable to update your password. Please try again.'
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
            ✳
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c66b43]">
            Secure your account
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-heading)]">
            Set a new password
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Choose a strong password that you don't use for another
            account.
          </p>
        </div>

        {success ? (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
          >
            <p className="font-semibold text-emerald-800">
              Password updated
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-700">
              Your password has been changed successfully. You can now
              sign in using your new password.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Continue to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
              >
                New password
              </label>

              <div className="relative">
                <input
                  id="new-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3.5 pr-20 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-muted)] hover:text-[#b85f39]"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm-new-password"
                className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
              >
                Confirm new password
              </label>
              <input
                id="confirm-new-password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your new password again"
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
              {loading ? 'Updating password...' : 'Update password'}
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