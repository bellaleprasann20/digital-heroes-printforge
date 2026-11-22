import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({
  onRegister,
  loading = false,
  error = '',
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setValidationError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName || !email || !form.password || !form.confirmPassword) {
      setValidationError('Please complete all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 8) {
      setValidationError('Password must contain at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError('Your passwords do not match.');
      return;
    }

    if (!form.acceptTerms) {
      setValidationError('Please accept the terms to continue.');
      return;
    }

    if (typeof onRegister !== 'function') {
      setValidationError('Registration service is not connected yet.');
      return;
    }

    try {
      const result = await onRegister({
        fullName,
        email,
        phone: form.phone.trim(),
        password: form.password,
      });

      if (result?.redirectTo) {
        navigate(result.redirectTo, { replace: true });
      }
    } catch (err) {
      setValidationError(
        err?.message || 'Unable to create your account. Please try again.'
      );
    }
  };

  const message = validationError || error;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[var(--color-background)] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl lg:grid-cols-2">
        <section className="relative hidden min-h-[760px] flex-col justify-between overflow-hidden bg-[#202a25] p-12 text-white lg:flex">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-8 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#c66b43]/20 blur-3xl" />

          <Link to="/" className="relative z-10 inline-flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#d77c50] text-lg font-black">
              P
            </span>
            <span className="text-xl font-bold tracking-tight">
              PrintForge
            </span>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f0b18e]">
              Made for makers
            </p>

            <h1 className="text-4xl font-semibold leading-tight xl:text-5xl">
              Your next great
              <span className="text-[#e49a70]"> print starts here.</span>
            </h1>

            <p className="mt-6 text-base leading-8 text-white/65">
              Bring your ideas to life with specialist print products,
              artwork proofs, and a workspace that keeps every order
              organised.
            </p>

            <div className="mt-10 space-y-4">
              {[
                'Save and manage your designs',
                'Review proofs before production',
                'Track orders from start to finish',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d77c50]/20 text-sm text-[#f0b18e]">
                    ✓
                  </span>
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-xs text-white/40">
            Create your account. Make something memorable.
          </p>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-8">
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
                Get started
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-heading)]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Set up your PrintForge workspace in a few steps.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
                >
                  Full name
                </label>
                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
                >
                  Email address
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="register-phone"
                  className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
                >
                  Phone number <span className="font-normal text-[var(--color-muted)]">(optional)</span>
                </label>
                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Your contact number"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 pr-20 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
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

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
                >
                  Confirm password
                </label>
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter your password again"
                  required
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none transition focus:border-[#c66b43] focus:ring-4 focus:ring-[#c66b43]/10"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 py-1 text-xs leading-5 text-[var(--color-muted)]">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={form.acceptTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#c66b43]"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="font-semibold text-[#b85f39] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-semibold text-[#b85f39] hover:underline">
                    Privacy Policy
                  </Link>.
                </span>
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
                {loading ? 'Creating account...' : 'Create account'}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[var(--color-muted)]">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-[#b85f39] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}