import { Link, useLocation, useParams } from 'react-router-dom';

const formatCurrency = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function OrderSuccess({
  order = null,
  loading = false,
  error = '',
  onDownloadInvoice,
}) {
  const location = useLocation();
  const { orderId } = useParams();

  const currentOrder = order || location.state?.order || null;

  if (loading) {
    return (
      <div className="mx-auto mt-12 h-96 max-w-2xl animate-pulse rounded-2xl bg-[var(--color-border)]" />
    );
  }

  if (error || !currentOrder) {
    return (
      <main className="flex min-h-[65vh] items-center justify-center bg-[var(--color-background)] px-4 py-12">
        <section className="w-full max-w-xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-2xl text-amber-700">
            !
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[var(--color-heading)]">
            Order confirmation unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            {error || 'We could not find the order confirmation details. Check your order history for the latest status.'}
          </p>
          <Link
            to="/account/orders"
            className="mt-6 inline-block rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white"
          >
            View my orders
          </Link>
        </section>
      </main>
    );
  }

  const paymentStatus = String(
    currentOrder.paymentStatus || currentOrder.payment?.status || 'pending'
  ).toLowerCase();

  const isPaid = ['paid', 'captured', 'success', 'completed'].includes(paymentStatus);

  return (
    <main className="min-h-[65vh] bg-[var(--color-background)] px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
        <div className="bg-[#202a25] px-6 py-10 text-center text-white sm:px-10">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/15 text-3xl text-emerald-300">
            ✓
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#e49a70]">
            {isPaid ? 'Payment confirmed' : 'Order received'}
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            {isPaid ? 'Thank you for your order!' : 'Your order has been received'}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/65">
            {isPaid
              ? 'Your payment has been confirmed. You can follow the progress of your order from your account.'
              : 'Your order is recorded. Payment status is still being confirmed. Check your order details for updates.'}
          </p>
        </div>

        <div className="p-6 sm:p-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--color-muted)]">
                  Order reference
                </p>
                <p className="mt-1 font-bold text-[var(--color-heading)]">
                  {currentOrder.orderNumber || orderId || currentOrder.id || currentOrder._id}
                </p>
              </div>

              <span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {paymentStatus.replaceAll('_', ' ')}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
              <span className="text-sm text-[var(--color-muted)]">
                Order total
              </span>
              <span className="text-xl font-bold text-[var(--color-heading)]">
                {formatCurrency(
                  currentOrder.totalAmount ?? currentOrder.total,
                  currentOrder.currency
                )}
              </span>
            </div>
          </div>

          <div className="mt-7">
            <h2 className="font-bold text-[var(--color-heading)]">
              What happens next?
            </h2>
            <div className="mt-5 space-y-5">
              {[
                ['01', 'Order processing', 'Your order details are reviewed.'],
                ['02', 'Artwork and proof', 'Artwork is prepared and sent to you for approval when required.'],
                ['03', 'Production', 'Approved print-ready artwork moves into production.'],
                ['04', 'Completion', 'Follow the order status from your customer account.'],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#c66b43]/10 text-xs font-bold text-[#b85f39]">
                    {number}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-heading)]">
                      {title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to={`/account/orders/${currentOrder.id || currentOrder._id || orderId}`}
              className="rounded-xl bg-[#bd6540] px-5 py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#a95432]"
            >
              View order details
            </Link>

            <button
              type="button"
              onClick={() => onDownloadInvoice?.(currentOrder)}
              disabled={!onDownloadInvoice}
              className="rounded-xl border border-[var(--color-border)] px-5 py-3.5 text-sm font-bold text-[var(--color-heading)] transition hover:border-[#c66b43] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download invoice
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm font-semibold text-[#b85f39] hover:underline"
            >
              Continue shopping →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}