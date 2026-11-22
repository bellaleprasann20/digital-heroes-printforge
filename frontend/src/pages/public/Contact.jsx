
import React, { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Contact = ({
  onSubmit,
  submitting = false,
  successMessage = '',
  error = null,
}) => {
  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setValidationErrors((current) => ({
      ...current,
      [name]: '',
    }));
  };

  const validate = () => {
    const errors = {};

    if (!form.name.trim()) errors.name = 'Please enter your name.';

    if (!form.email.trim()) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address.';
    }

    if (form.phone && !/^[+()\d\s-]{7,20}$/.test(form.phone)) {
      errors.phone = 'Enter a valid phone number.';
    }

    if (!form.subject.trim()) errors.subject = 'Please enter a subject.';

    if (form.message.trim().length < 10) {
      errors.message = 'Please provide at least 10 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || !validate()) return;

    if (typeof onSubmit !== 'function') {
      setValidationErrors({
        form: 'The contact service is not connected yet. Please try again later.',
      });
      return;
    }

    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setForm(initialForm);
      setValidationErrors({});
    } catch {
      // The parent should expose the API error through the error prop.
    }
  };

  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]';

  const fieldError = (name) =>
    validationErrors[name] ? (
      <p className="mt-1.5 text-xs text-red-600">{validationErrors[name]}</p>
    ) : null;

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-14 sm:px-6 lg:py-20">
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-5xl">
            Let's talk about your next print project.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
            Tell us what you're working on, what you need printed, and how we
            can help.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <aside className="space-y-5">
          <div className="rounded-2xl bg-[var(--color-heading)] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
              Contact PrintForge
            </p>
            <h2 className="mt-3 text-2xl font-bold">
              Have a question?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Use the form to send your enquiry. Our team can follow up using
              the contact details you provide.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="font-bold text-[var(--color-heading)]">
              Product enquiries
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              Include the product type, dimensions, material, quantity, and
              any artwork requirements when possible.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="font-bold text-[var(--color-heading)]">
              Order support
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              If your enquiry concerns an existing order, include your order
              number so the team can locate it.
            </p>
          </div>
        </aside>

        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8">
          <h2 className="text-xl font-bold text-[var(--color-heading)]">
            Send an enquiry
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Fields marked with * are required.
          </p>

          {successMessage && (
            <div role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {error && (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {validationErrors.form && (
            <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {validationErrors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                  Full name *
                </label>
                <input
                  id="contact-name"
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputClass}
                />
                {fieldError('name')}
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                  Email address *
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={inputClass}
                />
                {fieldError('email')}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-phone" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                  Phone number
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  autoComplete="tel"
                  placeholder="Your phone number"
                  className={inputClass}
                />
                {fieldError('phone')}
              </div>

              <div>
                <label htmlFor="contact-subject" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  value={form.subject}
                  onChange={updateField}
                  placeholder="How can we help?"
                  className={inputClass}
                />
                {fieldError('subject')}
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
                Your message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={updateField}
                rows={6}
                maxLength={5000}
                placeholder="Tell us about your print requirements..."
                className={`${inputClass} resize-y`}
              />
              <div className="mt-1.5 flex items-center justify-between gap-3">
                {fieldError('message')}
                <span className="ml-auto text-xs text-[var(--color-muted)]">
                  {form.message.length}/5000
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
};

export default Contact;
