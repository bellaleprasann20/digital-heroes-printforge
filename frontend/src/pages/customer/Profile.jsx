import { useEffect, useState } from 'react';

export default function Profile({
  user = null,
  onUpdate,
  loading = false,
  saving = false,
  error = '',
}) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    setForm({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      companyName: user?.companyName || '',
    });
  }, [user]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setMessage('Please enter your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (typeof onUpdate !== 'function') {
      setMessage('Profile update service is not connected yet.');
      return;
    }

    try {
      await onUpdate({
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
      });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err?.message || 'Unable to update your profile.');
    }
  };

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
          Account settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
          Your profile
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Manage the contact information associated with your account.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
      >
        <div className="mb-8 flex items-center gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#c66b43]/10 text-2xl font-bold text-[#b85f39]">
            {(form.fullName || form.email || 'P').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-[var(--color-heading)]">
              Personal information
            </h2>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Update your details below.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="profile-name" className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
              Full name
            </label>
            <input
              id="profile-name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="profile-email" className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
              Email address
            </label>
            <input
              id="profile-email"
              type="email"
              value={form.email}
              readOnly
              className="w-full cursor-not-allowed rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-muted)]"
            />
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Email changes should be handled through your authentication provider.
            </p>
          </div>

          <div>
            <label htmlFor="profile-phone" className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
              Phone number
            </label>
            <input
              id="profile-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
            />
          </div>

          <div>
            <label htmlFor="profile-company" className="mb-2 block text-sm font-semibold text-[var(--color-heading)]">
              Company name
            </label>
            <input
              id="profile-company"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
            />
          </div>
        </div>

        {(message || error) && (
          <p
            role="status"
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              error || message.includes('Unable')
                ? 'bg-red-50 text-red-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {message || error}
          </p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#bd6540] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#a95432] disabled:opacity-60"
          >
            {saving ? 'Saving changes...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}