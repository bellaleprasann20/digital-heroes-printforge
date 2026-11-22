
import React, { useEffect, useState } from 'react';

const defaultDetails = {
  fullName: '',
  email: '',
  phone: '',
  company: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

const Field = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = 'text',
  required = false,
  placeholder = '',
  autoComplete,
}) => (
  <div>
    <label
      htmlFor={name}
      className="mb-2 block text-sm font-medium text-[var(--color-heading)]"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value || ''}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      className={`w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10 ${
        error
          ? 'border-red-500'
          : 'border-[var(--color-border)]'
      }`}
    />

    {error && (
      <p id={`${name}-error`} className="mt-1.5 text-xs text-red-500">
        {error}
      </p>
    )}
  </div>
);

const BillingDetails = ({
  initialValue = {},
  value,
  onChange,
  errors = {},
  disabled = false,
  className = '',
}) => {
  const [details, setDetails] = useState({
    ...defaultDetails,
    ...initialValue,
    ...(value || {}),
  });

  useEffect(() => {
    if (value) {
      setDetails({ ...defaultDetails, ...value });
    }
  }, [value]);

  const updateField = (event) => {
    const { name, value: fieldValue } = event.target;

    setDetails((current) => {
      const next = { ...current, [name]: fieldValue };
      onChange?.(next);
      return next;
    });
  };

  const fields = [
    {
      label: 'Full name',
      name: 'fullName',
      required: true,
      placeholder: 'Enter your full name',
      autoComplete: 'name',
    },
    {
      label: 'Email address',
      name: 'email',
      type: 'email',
      required: true,
      placeholder: 'you@example.com',
      autoComplete: 'email',
    },
    {
      label: 'Phone number',
      name: 'phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter your phone number',
      autoComplete: 'tel',
    },
    {
      label: 'Company (optional)',
      name: 'company',
      placeholder: 'Company or business name',
      autoComplete: 'organization',
    },
    {
      label: 'Address line 1',
      name: 'addressLine1',
      required: true,
      placeholder: 'Street address, building, etc.',
      autoComplete: 'address-line1',
      wide: true,
    },
    {
      label: 'Address line 2 (optional)',
      name: 'addressLine2',
      placeholder: 'Apartment, suite, landmark, etc.',
      autoComplete: 'address-line2',
      wide: true,
    },
    {
      label: 'City',
      name: 'city',
      required: true,
      placeholder: 'City',
      autoComplete: 'address-level2',
    },
    {
      label: 'State',
      name: 'state',
      required: true,
      placeholder: 'State',
      autoComplete: 'address-level1',
    },
    {
      label: 'PIN code',
      name: 'postalCode',
      required: true,
      placeholder: 'Postal code',
      autoComplete: 'postal-code',
    },
    {
      label: 'Country',
      name: 'country',
      required: true,
      placeholder: 'Country',
      autoComplete: 'country-name',
    },
  ];

  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 ${className}`}>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Checkout
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
          Billing details
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Enter the details to be used for your order and invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.wide ? 'sm:col-span-2' : ''}
          >
            <Field
              {...field}
              value={details[field.name]}
              onChange={updateField}
              error={errors[field.name]}
            />
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-[var(--color-muted)]">
        Fields marked with * are required. Your details should be validated
        again by the server before the order is created.
      </p>
    </section>
  );
};

export default BillingDetails;
