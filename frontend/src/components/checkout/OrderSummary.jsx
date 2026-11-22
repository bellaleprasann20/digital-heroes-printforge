
import React from 'react';

const formatMoney = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const OrderSummary = ({
  items = [],
  subtotal = 0,
  discount = 0,
  tax = 0,
  shipping = 0,
  total = 0,
  currency = 'INR',
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 ${className}`}>
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--color-surface-soft)]" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-16 animate-pulse rounded-xl bg-[var(--color-surface-soft)]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-heading)]">
          Order summary
        </h2>
        <span className="text-sm text-[var(--color-muted)]">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--color-muted)]">
          Your order is empty.
        </p>
      ) : (
        <div className="mt-5 divide-y divide-[var(--color-border)]">
          {items.map((item, index) => {
            const id = item.id || item._id || `${item.name || 'item'}-${index}`;
            const quantity = Number(item.quantity) || 1;
            const unitPrice = Number(item.unitPrice ?? item.price) || 0;
            const lineTotal = Number(item.lineTotal ?? item.total) || unitPrice * quantity;
            const image = item.imageUrl || item.image || item.thumbnail;

            return (
              <div key={id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-soft)]">
                  {image ? (
                    <img
                      src={image}
                      alt={item.name || 'Order item'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--color-heading)]">
                    {item.name || item.productName || 'Product'}
                  </p>
                  {item.variant && (
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {item.variant}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    Qty: {quantity}
                    {item.size ? ` · ${item.size}` : ''}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-[var(--color-heading)]">
                  {formatMoney(lineTotal, currency)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-[var(--color-muted)]">Subtotal</span>
          <span className="font-medium text-[var(--color-heading)]">
            {formatMoney(subtotal, currency)}
          </span>
        </div>

        {Number(discount) > 0 && (
          <div className="flex justify-between gap-4">
            <span className="text-[var(--color-muted)]">Discount</span>
            <span className="font-medium text-emerald-600">
              −{formatMoney(discount, currency)}
            </span>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <span className="text-[var(--color-muted)]">Tax</span>
          <span className="font-medium text-[var(--color-heading)]">
            {formatMoney(tax, currency)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-[var(--color-muted)]">Shipping</span>
          <span className="font-medium text-[var(--color-heading)]">
            {Number(shipping) === 0 ? 'Calculated at checkout' : formatMoney(shipping, currency)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-5">
        <span className="font-bold text-[var(--color-heading)]">Total</span>
        <span className="text-xl font-extrabold text-[var(--color-primary)]">
          {formatMoney(total, currency)}
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
        Final charges are based on the pricing returned by the server.
      </p>
    </section>
  );
};

export default OrderSummary;
