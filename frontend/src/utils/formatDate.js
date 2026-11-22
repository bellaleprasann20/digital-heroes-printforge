const DEFAULT_LOCALE = 'en-IN';
const DEFAULT_TIMEZONE = 'Asia/Kolkata';

function parseDate(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(
  value,
  options = {}
) {
  const date = parseDate(value);

  if (!date) return '—';

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: DEFAULT_TIMEZONE,
    ...options,
  }).format(date);
}

export function formatDateTime(value) {
  return formatDate(value, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatTime(value) {
  const date = parseDate(value);

  if (!date) return '—';

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: DEFAULT_TIMEZONE,
  }).format(date);
}

export function formatRelativeDate(value) {
  const date = parseDate(value);

  if (!date) return '—';

  const now = new Date();
  const difference = date.getTime() - now.getTime();
  const days = Math.round(difference / (1000 * 60 * 60 * 24));

  const formatter = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, {
    numeric: 'auto',
  });

  if (Math.abs(days) >= 1) {
    return formatter.format(days, 'day');
  }

  const hours = Math.round(difference / (1000 * 60 * 60));

  if (Math.abs(hours) >= 1) {
    return formatter.format(hours, 'hour');
  }

  const minutes = Math.round(difference / (1000 * 60));

  return formatter.format(minutes, 'minute');
}

export function formatDateForInput(value) {
  const date = parseDate(value);

  if (!date) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default formatDate;