
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const initialAddress = {
  fullName: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

const formatCurrency = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

// Calculate the estimated line total for a cart item.
const getItemLineTotal = (item) => {
  const quantity = Number(item.quantity) || 1;

  const existingLineTotal =
    item.lineTotal ??
    item.quote?.lineTotal ??
    item.total;

  if (
    existingLineTotal !== undefined &&
    existingLineTotal !== null &&
    Number.isFinite(Number(existingLineTotal))
  ) {
    return Number(existingLineTotal);
  }

  const unitPrice = Number(
    item.unitPrice ??
    item.quote?.unitPrice ??
    item.price ??
    0
  );

  return unitPrice * quantity;
};

export default function Checkout({
  cart = [],
  user = null,
  quote = null,
  loading = false,
  submitting = false,
  error = '',
  onCheckout,
}) {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    ...initialAddress,
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState(initialAddress);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const currency = quote?.currency || cart[0]?.currency || 'INR';

  // Estimated subtotal from the cart or server quote.
  const subtotal = Number(
    quote?.subtotal ??
    cart.reduce(
      (sum, item) => sum + getItemLineTotal(item),
      0
    )
  );

  const discount = Number(quote?.discount || 0);
  const tax = Number(quote?.taxAmount ?? quote?.tax ?? 0);

  const total = Number(
    quote?.totalAmount ??
    quote?.total ??
    subtotal - discount + tax
  );

  const updateAddress = (event, isDelivery = false) => {
    const { name, value } = event.target;

    if (isDelivery) {
      setDeliveryAddress((current) => ({
        ...current,
        [name]: value,
      }));
    } else {
      setAddress((current) => ({
        ...current,
        [name]: value,
      }));
    }
  };

  const validateAddress = (value, label) => {
    const required = [
      'fullName',
      'email',
      'phone',
      'addressLine1',
      'city',
      'state',
      'postalCode',
      'country',
    ];

    for (const field of required) {
      if (!String(value[field] || '').trim()) {
        return `${label}: please complete all required fields.`;
      }
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim())) {
      return `${label}: please enter a valid email address.`;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(value.phone.trim())) {
      return `${label}: please enter a valid phone number.`;
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError('');

    if (cart.length === 0) {
      setValidationError(
        'Your cart is empty. Add a product before checkout.'
      );
      return;
    }

    const billingError = validateAddress(
      address,
      'Billing details'
    );

    if (billingError) {
      setValidationError(billingError);
      return;
    }

    const shipping = sameAsBilling
      ? address
      : deliveryAddress;

    const shippingError = validateAddress(
      shipping,
      'Delivery details'
    );

    if (shippingError) {
      setValidationError(shippingError);
      return;
    }

    if (typeof onCheckout !== 'function') {
      setValidationError(
        'Checkout service is not connected yet.'
      );
      return;
    }

    try {
      const result = await onCheckout({
        billingAddress: address,
        shippingAddress: shipping,
        notes: notes.trim(),
      });

      if (result?.redirectTo) {
        navigate(result.redirectTo);
      } else if (result?.orderId) {
        navigate(
          `/account/order-success/${result.orderId}`,
          {
            replace: true,
            state: {
              order: result.order || null,
            },
          }
        );
      }
    } catch (err) {
      setValidationError(
        err?.message ||
        'Unable to complete checkout. Please try again.'
      );
    }
  };

  const addressFields = (value, isDelivery = false) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {[
        ['fullName', 'Full name', 'text', true],
        ['email', 'Email address', 'email', true],
        ['phone', 'Phone number', 'tel', true],
        ['addressLine1', 'Address line 1', 'text', true],
        ['addressLine2', 'Address line 2', 'text', false],
        ['city', 'City', 'text', true],
        ['state', 'State', 'text', true],
        ['postalCode', 'PIN / ZIP code', 'text', true],
        ['country', 'Country', 'text', true],
      ].map(([name, label, type, required]) => (
        <div
          key={`${isDelivery ? 'delivery' : 'billing'}-${name}`}
          className={
            name.startsWith('addressLine')
              ? 'sm:col-span-2'
              : ''
          }
        >
          <label
            htmlFor={`${isDelivery ? 'delivery' : 'billing'}-${name}`}
            className="mb-2 block text-sm font-semibold text-[var(--color-heading)]"
          >
            {label}{required ? ' *' : ''}
          </label>

          <input
            id={`${isDelivery ? 'delivery' : 'billing'}-${name}`}
            name={name}
            type={type}
            value={value[name] || ''}
            onChange={(event) =>
              updateAddress(event, isDelivery)
            }
            required={required}
            autoComplete={isDelivery ? 'shipping' : 'billing'}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
          />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto h-96 max-w-6xl animate-pulse rounded-2xl bg-[var(--color-border)]" />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-16 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-heading)]">
          Your cart is empty
        </h1>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Add a product before continuing to checkout.
        </p>

        <Link
          to="/products"
          className="mt-5 inline-block rounded-xl bg-[#bd6540] px-5 py-3 text-sm font-bold text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">
          Secure checkout
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">
          Complete your order
        </h1>

        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Confirm your contact details and delivery address.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]"
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <h2 className="mb-6 text-lg font-bold text-[var(--color-heading)]">
              Billing details
            </h2>

            {addressFields(address)}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <h2 className="text-lg font-bold text-[var(--color-heading)]">
              Delivery details
            </h2>

            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-[var(--color-muted)]">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={(event) =>
                  setSameAsBilling(event.target.checked)
                }
                className="h-4 w-4 accent-[#bd6540]"
              />

              Same as billing address
            </label>

            {!sameAsBilling && (
              <div className="mt-6">
                {addressFields(deliveryAddress, true)}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <label
              htmlFor="checkout-notes"
              className="block text-lg font-bold text-[var(--color-heading)]"
            >
              Order notes
            </label>

            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Optional instructions for your order.
            </p>

            <textarea
              id="checkout-notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              maxLength={1000}
              placeholder="Add any special delivery or order instructions..."
              className="mt-4 w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
            />
          </section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[var(--color-heading)]">
              Order summary
            </h2>

            <div className="mt-5 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={item.cartItemId || item.id || item._id || index}
                  className="flex gap-3"
                >
                  {item.imageUrl || item.image ? (
                    <img
                      src={item.imageUrl || item.image}
                      alt={
                        item.name ||
                        item.productName ||
                        'Product'
                      }
                      className="h-14 w-14 rounded-lg border border-[var(--color-border)] object-cover"
                    />
                  ) : (
                    <div className="grid h-14 w-14 place-items-center rounded-lg bg-[var(--color-background)] text-xl text-[var(--color-muted)]">
                      ▧
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-[var(--color-heading)]">
                      {item.name ||
                        item.productName ||
                        'Print product'}
                    </p>

                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[var(--color-heading)]">
                    {formatCurrency(
                      getItemLineTotal(item),
                      currency
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-5 text-sm">
              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>
                    -{formatCurrency(discount, currency)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[var(--color-muted)]">
                <span>Tax</span>
                <span>{formatCurrency(tax, currency)}</span>
              </div>

              <div className="flex justify-between border-t border-[var(--color-border)] pt-4 text-base font-bold text-[var(--color-heading)]">
                <span>Total payable</span>
                <span>{formatCurrency(total, currency)}</span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-[var(--color-muted)]">
              This is an estimated cart amount unless a
              server-generated price quote is available.
              Final product prices, taxes and applicable
              discounts are recalculated by the server
              before payment.
            </p>

            {(validationError || error) && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {validationError || error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || cart.length === 0}
              className="mt-6 w-full rounded-xl bg-[#bd6540] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#a95432] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? 'Preparing secure payment...'
                : `Continue to payment · ${formatCurrency(total, currency)}`}
            </button>

            <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
              Payment is processed through the configured
              payment provider.
            </p>
          </section>

          <Link
            to="/cart"
            className="block text-center text-sm font-semibold text-[#b85f39] hover:underline"
          >
            ← Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}
