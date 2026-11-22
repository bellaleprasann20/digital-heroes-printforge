
import React, { useState } from 'react';

const formatMoney = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const InvoiceCard = ({
  invoice,
  onDownload,
  loading = false,
  className = '',
}) => {
  const [downloading, setDownloading] = useState(false);

  if (!invoice) return null;

  const invoiceNumber =
    invoice.invoiceNumber || invoice.number || invoice.id || 'Invoice';

  const handleDownload = async () => {
    if (downloading || loading) return;

    try {
      setDownloading(true);

      if (onDownload) {
        await onDownload(invoice);
        return;
      }

      if (invoice.downloadUrl) {
        window.open(invoice.downloadUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Invoice download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  const paymentStatus = String(invoice.paymentStatus || invoice.status || 'unknown').toLowerCase();
  const paid = ['paid', 'success', 'completed'].includes(paymentStatus);

  return (
    <article className={`flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-soft)] text-xl text-[var(--color-primary)]">
          ▧
        </div>

        <div className="min-w-0">
          <h3 className="truncate font-bold text-[var(--color-heading)]">
            {invoiceNumber}
          </h3>

          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Order: {invoice.orderNumber || invoice.orderId || '—'}
          </p>

          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Issued {formatDate(invoice.issuedAt || invoice.createdAt)}
          </p>

          <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            paid
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-800'
          }`}>
            {paymentStatus.replaceAll('_', ' ')}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="sm:text-right">
          <p className="text-xs text-[var(--color-muted)]">Invoice total</p>
          <p className="mt-1 text-lg font-extrabold text-[var(--color-heading)]">
            {formatMoney(invoice.totalAmount ?? invoice.total, invoice.currency || 'INR')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading || loading || (!onDownload && !invoice.downloadUrl)}
          className="shrink-0 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading ? 'Preparing...' : '↓ Download'}
        </button>
      </div>
    </article>
  );
};

export default InvoiceCard;
