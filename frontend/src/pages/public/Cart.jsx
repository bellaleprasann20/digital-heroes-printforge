
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const formatMoney = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function Cart() {
  const {
    items,
    itemCount,
    estimatedSubtotal,
    isEmpty,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <p className="eyebrow">Your shopping bag</p>
          <h1 className="mt-3 text-4xl font-extrabold text-[var(--color-heading)]">
            Shopping Cart
          </h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:px-6 lg:py-14">
        {isEmpty ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
            <div className="text-5xl">🛒</div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--color-heading)]">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-[var(--color-muted)]">
              You haven't added any products yet. Explore our collection
              and find something you like.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[var(--color-heading)]">
                  Cart Items
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-semibold text-red-500 hover:underline"
                >
                  Clear cart
                </button>
              </div>

              {items.map((item) => {
                const image =
                  item.imageUrl ||
                  item.image_url ||
                  item.image ||
                  item.thumbnail;

                const price = Number(
                  item.unitPrice ??
                  item.startingPrice ??
                  item.basePrice ??
                  item.base_price ??
                  item.price ??
                  0
                );

                return (
                  <article
                    key={item.cartItemId}
                    className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row"
                  >
                    <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-soft)] sm:w-32">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-[var(--color-heading)]">
                          {item.name || 'Print product'}
                        </h3>

                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          {item.categoryName || item.division || 'Print product'}
                        </p>

                        <p className="mt-2 font-bold text-[var(--color-heading)]">
                          {formatMoney(price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity - 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)]"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <span className="min-w-5 text-center font-semibold text-[var(--color-heading)]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.cartItemId,
                                item.quantity + 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-text)]"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-sm font-semibold text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right font-extrabold text-[var(--color-heading)] sm:min-w-28">
                      {formatMoney(price * item.quantity)}
                    </div>
                  </article>
                );
              })}

              <Link
                to="/products"
                className="inline-flex text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>

            <aside className="h-fit rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
              <h2 className="text-xl font-bold text-[var(--color-heading)]">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-sm text-[var(--color-muted)]">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>

              <div className="mt-4 flex justify-between text-sm text-[var(--color-muted)]">
                <span>Subtotal (estimate)</span>
                <span>{formatMoney(estimatedSubtotal)}</span>
              </div>

              <div className="my-5 border-t border-[var(--color-border)]" />

              <div className="flex justify-between gap-3 text-lg font-extrabold text-[var(--color-heading)]">
                <span>Estimated Total</span>
                <span>{formatMoney(estimatedSubtotal)}</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[var(--color-muted)]">
                Final pricing, customisation charges, shipping and taxes
                will be confirmed during checkout.
              </p>

              <Link
                to="/account/checkout"
                className="mt-7 flex w-full justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
