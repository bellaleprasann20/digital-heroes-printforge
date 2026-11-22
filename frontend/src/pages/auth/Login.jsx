import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({
  onLogin,
  loading = false,
  error = '',
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setValidationError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = form.email.trim();

    if (!email || !form.password) {
      setValidationError('Please enter your email and password.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (typeof onLogin !== 'function') {
      setValidationError('Login service is not connected yet.');
      return;
    }

    try {
      const result = await onLogin({
        email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

      if (result?.redirectTo) {
        navigate(result.redirectTo, { replace: true });
      }
    } catch (err) {
      setValidationError(
        err?.message || 'Unable to sign in. Please try again.'
      );
    }
  };

  const message = validationError || error;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl lg:grid-cols-2">
        <section className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden bg-[#202a25] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#c66b43]/20 blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#d77c50] text-lg font-black">
                P
              </span>
              <span className="text-xl font-bold tracking-tight">
                PrintForge
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0b18e]">
              Your print workspace
            </span>

            <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
              Good to have you
              <span className="text-[#e49a70]"> back.</span>
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/65">
              Manage your designs, review proofs, follow production, and
              keep every print project moving.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              {['Design', 'Approve', 'Print'].map((item, index) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="text-xs text-white/45">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-sm font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/40">
            Custom print. Thoughtfully produced.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-9">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-heading)] lg:hidden"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#c66b43] text-white">
                  P
                </span>
                PrintForge
              </Link>

              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#c66b43]">
                Welcome back
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-heading)]">
                Sign in to your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Enter your account details to continue to PrintForge.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3.5 text-sm text-[var(--color-text)] outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-semibold text-[var(--color-heading)]"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-[#b85f39] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3.5 pr-20 text-sm text-[var(--color-text)] outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-muted)] hover:text-[#b85f39]"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 accent-[#c66b43]"
                />
                Keep me signed in
              </label>

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
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#bd6540] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#bd6540]/15 transition hover:bg-[#a95432] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
              New to PrintForge?{' '}
              <Link
                to="/register"
                className="font-bold text-[#b85f39] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-10 text-center text-xs text-[var(--color-muted)]">
              By continuing, you agree to our terms and privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}