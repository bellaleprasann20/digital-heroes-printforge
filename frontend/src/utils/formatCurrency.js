const DEFAULT_CURRENCY = 'INR';
const DEFAULT_LOCALE = 'en-IN';

export function formatCurrency(
  amount,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return '—';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function formatCompactCurrency(
  amount,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return '—';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function parseCurrency(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== 'string') return null;

  const normalized = value.replace(/[₹,\s]/g, '');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

export default formatCurrency;