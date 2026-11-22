
import React from 'react';

const statusConfig = {
  pending: {
    icon: '○',
    title: 'Payment pending',
    description: 'Your payment has not been completed yet.',
    iconClass: 'bg-amber-100 text-amber-700',
  },
  processing: {
    icon: '◷',
    title: 'Verifying payment',
    description: 'Please wait while we confirm your payment with the payment provider.',
    iconClass: 'bg-blue-100 text-blue-700',
  },
  success: {
    icon: '✓',
    title: 'Payment successful',
    description: 'Your payment has been verified. Your order is being processed.',
    iconClass: 'bg-emerald-100 text-emerald-700',
  },
  failed: {
    icon: '!',
    title: 'Payment failed',
    description: 'We could not complete your payment. You can try again.',
    iconClass: 'bg-red-100 text-red-700',
  },
  cancelled: {
    icon: '×',
    title: 'Payment cancelled',
    description: 'The payment process was cancelled before completion.',
    iconClass: 'bg-gray-100 text-gray-700',
  },
};

const PaymentStatus = ({
  status = 'pending',
  orderId,
  paymentId,
  message,
  onRetry,
  onContinue,
  onViewOrder,
  className = '',
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  const isSuccess = status === 'success';
  const isProcessing = status === 'processing';

  return (
    <section className={`mx-auto w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-sm sm:p-9 ${className}`}>
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-3xl font-bold ${config.iconClass}`}
        aria-hidden="true"
      >
        {isProcessing ? (
          <span className="h-7 w-7 animate-spin rounded-full border-4 border-current/20 border-t-current" />
        ) : (
          config.icon
        )}
      </div>

      <h2 className="mt-6 text-2xl font-extrabold text-[var(--color-heading)]">
        {config.title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
        {message || config.description}
      </p>

      {(orderId || paymentId) && (
        <div className="mt-7 rounded-xl bg-[var(--color-surface-soft)] p-4 text-left">
          {orderId && (
            <div className="flex flex-wrap justify-between gap-2 py-1.5 text-sm">
              <span className="text-[var(--color-muted)]">Order ID</span>
              <span className="break-all font-semibold text-[var(--color-heading)]">
                {orderId}
              </span>
            </div>
          )}

          {paymentId && (
            <div className="flex flex-wrap justify-between gap-2 py-1.5 text-sm">
              <span className="text-[var(--color-muted)]">Payment ID</span>
              <span className="break-all font-semibold text-[var(--color-heading)]">
                {paymentId}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        {isSuccess && onViewOrder && (
          <button
            type="button"
            onClick={onViewOrder}
            className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            View order
          </button>
        )}

        {!isSuccess && !isProcessing && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            Try payment again
          </button>
        )}

        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)]"
          >
            Continue
          </button>
        )}
      </div>

      {isSuccess && (
        <p className="mt-6 text-xs text-[var(--color-muted)]">
          Keep your order ID for future reference. You can track your order from
          your customer dashboard.
        </p>
      )}
    </section>
  );
};

export default PaymentStatus;
