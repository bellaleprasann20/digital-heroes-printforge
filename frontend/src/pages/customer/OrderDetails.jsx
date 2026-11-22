import { Link, useParams } from 'react-router-dom';

const formatCurrency = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
};

const stages = [
  'Quote',
  'Order',
  'Artwork',
  'Proof',
  'Production',
  'Completed',
];

const stageIndex = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('cancel')) return -1;
  if (normalized.includes('complete')) return 5;
  if (normalized.includes('production')) return 4;
  if (normalized.includes('proof')) return 3;
  if (normalized.includes('artwork')) return 2;
  if (normalized.includes('order') || normalized.includes('paid')) return 1;
  return 0;
};

export default function OrderDetails({
  order = null,
  loading = false,
  error = '',
  onRetry,
  onReorder,
  onDownloadInvoice,
}) {
  const { orderId } = useParams();

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
        <h1 className="text-xl font-bold text-[var(--color-heading)]">
          {error ? 'Unable to load order' : 'Order not found'}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {error || 'This order may no longer be available.'}
        </p>
        {error && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 text-sm font-bold text-[#b85f39] underline"
          >
            Try again
          </button>
        )}
        <div>
          <Link
            to="/account/orders"
            className="mt-5 inline-block text-sm font-bold text-[#b85f39]"
          >
            ← Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const status = String(order.status || 'Pending').replaceAll('_', ' ');
  const currentStage = stageIndex(order.status);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="space-y-7">
      <header>
        <Link
          to="/account/orders"
          className="text-sm font-semibold text-[#b85f39] hover:underline"
        >
          ← Back to orders
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
              Order details
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
              {order.orderNumber || `Order ${orderId || ''}`}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#c66b43]/10 px-4 py-2 text-sm font-semibold capitalize text-[#a95432]">
            {status}
          </span>
        </div>
      </header>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
        <h2 className="font-bold text-[var(--color-heading)]">
          Production progress
        </h2>

        {currentStage < 0 ? (
          <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            This order has been cancelled.
          </p>
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {stages.map((stage, index) => {
              const complete = index <= currentStage;

              return (
                <div key={stage} className="relative">
                  <div className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                    complete
                      ? 'bg-[#bd6540] text-white'
                      : 'bg-[var(--color-background)] text-[var(--color-muted)]'
                  }`}>
                    {complete ? '✓' : index + 1}
                  </div>
                  <p className={`mt-3 text-xs font-semibold ${
                    complete
                      ? 'text-[var(--color-heading)]'
                      : 'text-[var(--color-muted)]'
                  }`}>
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] p-5">
            <h2 className="font-bold text-[var(--color-heading)]">
              Order items
            </h2>
          </div>

          {items.length === 0 ? (
            <p className="p-6 text-sm text-[var(--color-muted)]">
              No item details are available for this order.
            </p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {items.map((item, index) => (
                <div
                  key={item.id || item._id || index}
                  className="flex gap-4 p-5"
                >
                  {item.imageUrl || item.image ? (
                    <img
                      src={item.imageUrl || item.image}
                      alt={item.productName || item.name || 'Order item'}
                      className="h-20 w-20 rounded-xl border border-[var(--color-border)] object-cover"
                    />
                  ) : (
                    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-[var(--color-background)] text-2xl text-[var(--color-muted)]">
                      ▧
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[var(--color-heading)]">
                      {item.productName || item.name || 'Print product'}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      Quantity: {item.quantity ?? 1}
                    </p>
                    {item.configuration && (
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        {[
                          item.configuration.width && `${item.configuration.width} ${item.configuration.unit || ''}`,
                          item.configuration.height && `${item.configuration.height} ${item.configuration.unit || ''}`,
                          item.configuration.material,
                          item.configuration.orientation,
                        ].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 text-sm font-bold text-[var(--color-heading)]">
                    {formatCurrency(item.total ?? item.price, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 border-t border-[var(--color-border)] p-5">
            <div className="flex justify-between text-sm text-[var(--color-muted)]">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal, order.currency)}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-sm text-emerald-700">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount, order.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-[var(--color-muted)]">
              <span>Tax</span>
              <span>{formatCurrency(order.taxAmount ?? order.tax, order.currency)}</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-4 font-bold text-[var(--color-heading)]">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount ?? order.total, order.currency)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="font-bold text-[var(--color-heading)]">
              Delivery details
            </h2>
            <div className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
              <p className="font-semibold text-[var(--color-heading)]">
                {order.shippingAddress?.fullName || order.shippingAddress?.name || 'Delivery address'}
              </p>
              <p>
                {[
                  order.shippingAddress?.addressLine1,
                  order.shippingAddress?.addressLine2,
                  order.shippingAddress?.city,
                  order.shippingAddress?.state,
                  order.shippingAddress?.postalCode,
                  order.shippingAddress?.country,
                ].filter(Boolean).join(', ') || 'Address details unavailable'}
              </p>
              {order.shippingAddress?.phone && (
                <p>Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <h2 className="font-bold text-[var(--color-heading)]">
              Order actions
            </h2>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => onDownloadInvoice?.(order)}
                disabled={!onDownloadInvoice}
                className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:border-[#c66b43] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download invoice
              </button>
              <button
                type="button"
                onClick={() => onReorder?.(order)}
                disabled={!onReorder}
                className="w-full rounded-xl bg-[#bd6540] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#a95432] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reorder these items
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}