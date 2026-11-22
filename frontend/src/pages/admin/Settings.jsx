import { useEffect, useState } from 'react';

const defaultSettings = {
  businessName: '',
  supportEmail: '',
  supportPhone: '',
  businessAddress: '',
  currency: 'INR',
  taxRate: '',
  orderPrefix: 'PF',
  maintenanceMode: false,
  customerRegistration: true,
  orderNotifications: true,
  proofNotifications: true,
};

export default function Settings({
  settings = null,
  loading = false,
  error = '',
  saving = false,
  onSave,
  onRetry,
}) {
  const [form, setForm] = useState(defaultSettings);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (settings) {
      setForm({ ...defaultSettings, ...settings });
    }
  }, [settings]);

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setFormError('');

    if (form.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.supportEmail)) {
      setFormError('Enter a valid support email address.');
      return;
    }

    if (form.taxRate !== '' && (!Number.isFinite(Number(form.taxRate)) || Number(form.taxRate) < 0 || Number(form.taxRate) > 100)) {
      setFormError('Tax rate must be between 0 and 100.');
      return;
    }

    if (typeof onSave !== 'function') {
      setFormError('Settings service is not connected yet.');
      return;
    }

    try {
      await onSave({
        ...form,
        taxRate: form.taxRate === '' ? null : Number(form.taxRate),
      });
      setMessage('Settings saved successfully.');
    } catch (err) {
      setFormError(err?.message || 'Unable to save settings.');
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  const toggles = [
    ['maintenanceMode', 'Maintenance mode', 'Restrict customer access while maintenance is active.'],
    ['customerRegistration', 'Customer registration', 'Allow new customers to create accounts.'],
    ['orderNotifications', 'Order notifications', 'Enable configured order notification emails.'],
    ['proofNotifications', 'Proof notifications', 'Enable configured proof and revision notification emails.'],
  ];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Platform configuration</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Settings</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Manage business details and operational preferences.</p>
      </header>

      {(error || formError || message) && (
        <div role="status" className={`rounded-xl p-4 text-sm ${formError || error ? 'border border-red-200 bg-red-50 text-red-800' : 'border border-emerald-200 bg-emerald-50 text-emerald-800'}`}>
          {formError || error || message}
          {error && <button onClick={onRetry} className="ml-3 font-bold underline">Retry</button>}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <h2 className="font-bold text-[var(--color-heading)]">Business information</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Contact details displayed to customers.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {[
              ['businessName', 'Business name', 'text'],
              ['supportEmail', 'Support email', 'email'],
              ['supportPhone', 'Support phone', 'tel'],
              ['orderPrefix', 'Order number prefix', 'text'],
            ].map(([name, label, type]) => (
              <label key={name} className="text-sm font-semibold text-[var(--color-heading)]">
                {label}
                <input name={name} type={type} value={form[name] ?? ''} onChange={update} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal outline-none focus:border-[#c66b43]" />
              </label>
            ))}

            <label className="text-sm font-semibold text-[var(--color-heading)] sm:col-span-2">
              Business address
              <textarea name="businessAddress" rows={3} value={form.businessAddress ?? ''} onChange={update} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal outline-none focus:border-[#c66b43]" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <h2 className="font-bold text-[var(--color-heading)]">Pricing configuration</h2>
          <p className="mt-1 text-xs text-[var(--color-muted)]">These settings should be validated and applied by the server-side pricing service.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[var(--color-heading)]">
              Currency
              <select name="currency" value={form.currency} onChange={update} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal">
                <option value="INR">INR – Indian Rupee</option>
                <option value="USD">USD – US Dollar</option>
                <option value="EUR">EUR – Euro</option>
                <option value="GBP">GBP – Pound Sterling</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-[var(--color-heading)]">
              Tax rate (%)
              <input name="taxRate" type="number" min="0" max="100" step="0.01" value={form.taxRate ?? ''} onChange={update} placeholder="Configured tax percentage" className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal outline-none focus:border-[#c66b43]" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
          <h2 className="font-bold text-[var(--color-heading)]">Platform preferences</h2>
          <div className="mt-5 divide-y divide-[var(--color-border)]">
            {toggles.map(([name, label, description]) => (
              <label key={name} className="flex cursor-pointer items-center justify-between gap-5 py-4">
                <span>
                  <span className="block text-sm font-semibold text-[var(--color-heading)]">{label}</span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--color-muted)]">{description}</span>
                </span>
                <input
                  type="checkbox"
                  name={name}
                  checked={Boolean(form[name])}
                  onChange={update}
                  className="h-5 w-5 shrink-0 accent-[#bd6540]"
                />
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="rounded-xl bg-[#bd6540] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#a95432] disabled:opacity-50">
            {saving ? 'Saving settings...' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}