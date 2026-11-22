
import React from 'react';

function formatMoney(value, currency = 'INR') {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return '—';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function PriceSummary({
  pricing = null,
  loading = false,
  error = null,
  quantity = 1,
  onContinue,
  continueLabel = 'Continue to design',
  disabled = false,
}) {
  const currency = pricing?.currency || 'INR';

  if (loading) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <div className="h-5 w-36 animate-pulse rounded bg-[#eeeae3]" />
        <div className="mt-6 h-9 w-44 animate-pulse rounded bg-[#eeeae3]" />
        <div className="mt-6 space-y-3">
          <div className="h-4 animate-pulse rounded bg-[#eeeae3]" />
          <div className="h-4 animate-pulse rounded bg-[#eeeae3]" />
          <div className="h-4 animate-pulse rounded bg-[#eeeae3]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-5">
        <h3 className="font-bold text-[var(--color-heading)]">
          Pricing unavailable
        </h3>
        <p className="mt-2 text-sm leading-6 text-red-600">
          We couldn't calculate the price for this configuration. Please try again.
        </p>
      </section>
    );
  }

  if (!pricing || pricing.total == null) {
    return (
      <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
        <h3 className="text-base font-bold text-[var(--color-heading)]">
          Your price summary
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Select your product options to see the calculated price.
        </p>
      </section>
    );
  }

  const hasDiscount = Number(pricing.discount) > 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="border-b border-[var(--color-border)] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
          Your price summary
        </p>

        <div className="mt-3 flex items-end gap-2">
          <h3 className="text-3xl font-extrabold tracking-tight text-[var(--color-heading)]">
            {formatMoney(pricing.total, currency)}
          </h3>
          <span className="pb-1 text-xs text-[var(--color-muted)]">
            Total
          </span>
        </div>

        <p className="mt-2 text-xs text-[var(--color-muted)]">
          For {Number(quantity).toLocaleString('en-IN')} units
        </p>
      </div>

      <div className="space-y-3 p-5">
        {pricing.unitPrice != null && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--color-text)]">Price per unit</span>
            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(pricing.unitPrice, currency)}
            </span>
          </div>
        )}

        {pricing.subtotal != null && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--color-text)]">Subtotal</span>
            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(pricing.subtotal, currency)}
            </span>
          </div>
        )}

        {hasDiscount && (
          <div className="flex items-start justify-between gap-3 text-sm">
            <div>
              <span className="font-semibold text-[#25845b]">
                Volume discount
              </span>
              {pricing.discountLabel && (
                <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                  {pricing.discountLabel}
                </p>
              )}
            </div>
            <span className="font-bold text-[#25845b]">
              −{formatMoney(pricing.discount, currency)}
            </span>
          </div>
        )}

        {pricing.tax != null && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--color-text)]">
              Tax{pricing.taxRate != null ? ` (${pricing.taxRate}%)` : ''}
            </span>
            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(pricing.tax, currency)}
            </span>
          </div>
        )}

        {pricing.shipping != null && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[var(--color-text)]">Shipping</span>
            <span className="font-semibold text-[var(--color-heading)]">
              {formatMoney(pricing.shipping, currency)}
            </span>
          </div>
        )}

        <div className="border-t border-dashed border-[var(--color-border)] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-[var(--color-heading)]">
              Total payable
            </span>
            <span className="text-xl font-extrabold text-[var(--color-primary-dark)]">
              {formatMoney(pricing.total, currency)}
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-5 text-[var(--color-muted)]">
            {pricing.taxIncluded === true
              ? 'Tax included in the total displayed.'
              : pricing.taxIncluded === false
                ? 'Tax is shown separately in this breakdown.'
                : 'Final tax treatment will be confirmed in the checkout calculation.'}
          </p>
        </div>

        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            disabled={disabled}
            className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {continueLabel}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </section>
  );
}
