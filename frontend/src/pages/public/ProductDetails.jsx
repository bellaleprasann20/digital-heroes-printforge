
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const formatMoney = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const ProductDetails = ({
  product,
  loading = false,
  error = null,
  onRetry,
  onCalculatePrice,
  onAddToCart,
}) => {
  const { slug } = useParams();

  const [configuration, setConfiguration] = useState({
    width: '',
    height: '',
    unit: 'mm',
    material: '',
    orientation: 'portrait',
    quantity: 1,
  });

  const [quote, setQuote] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    setQuote(null);
    setActionError('');
  }, [slug]);

  const updateConfiguration = (event) => {
    const { name, value } = event.target;

    setConfiguration((current) => ({
      ...current,
      [name]: name === 'quantity' ? Math.max(1, Number(value) || 1) : value,
    }));

    setQuote(null);
    setActionError('');
  };

  const handleCalculate = async () => {
    if (!product || calculating) return;

    if (
      !configuration.width ||
      !configuration.height ||
      Number(configuration.width) <= 0 ||
      Number(configuration.height) <= 0
    ) {
      setActionError('Enter valid width and height values.');
      return;
    }

    if (!configuration.material) {
      setActionError('Please select a material.');
      return;
    }

    if (typeof onCalculatePrice !== 'function') {
      setActionError('The pricing service is not connected yet.');
      return;
    }

    try {
      setCalculating(true);
      setActionError('');

      const result = await onCalculatePrice({
        productId: product.id || product._id,
        configuration,
      });

      if (!result) {
        throw new Error('The pricing service returned no quote.');
      }

      setQuote(result);
    } catch (err) {
      setActionError(err?.message || 'Unable to calculate the price.');
    } finally {
      setCalculating(false);
    }
  };

  const handleAddToCart = async () => {
    if (!quote || !product || !onAddToCart) return;

    try {
      setActionError('');

      await onAddToCart({
        product,
        configuration,
        quote,
      });
    } catch (err) {
      setActionError(err?.message || 'Unable to add this product to your cart.');
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-12 sm:px-6">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-[var(--color-surface-soft)]" />
          <div className="space-y-5">
            <div className="h-5 w-32 rounded bg-[var(--color-surface-soft)]" />
            <div className="h-10 w-3/4 rounded bg-[var(--color-surface-soft)]" />
            <div className="h-24 rounded bg-[var(--color-surface-soft)]" />
            <div className="h-48 rounded bg-[var(--color-surface-soft)]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="container mx-auto min-h-[60vh] px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-[var(--color-heading)]">
          {error ? 'Unable to load product' : 'Product not found'}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          {error || 'This product may have been removed or is no longer available.'}
        </p>
        {error && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
        )}
        <div>
          <Link
            to="/products"
            className="mt-5 inline-block text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const image = product.imageUrl || product.image || product.thumbnail;
  const materials = product.materials || [];
  const options = product.options || {};

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        <nav className="mb-8 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[var(--color-primary)]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-[var(--color-primary)]">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-heading)]">{product.name}</span>
        </nav>

        <div className="grid items-start gap-9 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-[var(--color-muted)]">
                Product image unavailable
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow">
              {product.categoryName || product.category || 'PrintForge product'}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-4xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
                {product.shortDescription}
              </p>
            )}

            {product.startingPrice != null && (
              <div className="mt-6">
                <p className="text-xs text-[var(--color-muted)]">Starting from</p>
                <p className="mt-1 text-2xl font-extrabold text-[var(--color-heading)]">
                  {formatMoney(product.startingPrice, product.currency || 'INR')}
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">
                  Final price depends on your selected specifications and quantity.
                </p>
              </div>
            )}

            {product.description && (
              <div className="mt-7 border-t border-[var(--color-border)] pt-6">
                <h2 className="font-bold text-[var(--color-heading)]">
                  About this product
                </h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--color-muted)]">
                  {product.description}
                </p>
              </div>
            )}

            <section className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6">
              <h2 className="text-lg font-bold text-[var(--color-heading)]">
                Configure your product
              </h2>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Choose your specifications to request a current price.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="product-width" className="mb-2 block text-xs font-semibold text-[var(--color-heading)]">
                    Width
                  </label>
                  <input
                    id="product-width"
                    name="width"
                    type="number"
                    min="0.01"
                    step="any"
                    value={configuration.width}
                    onChange={updateConfiguration}
                    placeholder="Width"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="product-height" className="mb-2 block text-xs font-semibold text-[var(--color-heading)]">
                    Height
                  </label>
                  <input
                    id="product-height"
                    name="height"
                    type="number"
                    min="0.01"
                    step="any"
                    value={configuration.height}
                    onChange={updateConfiguration}
                    placeholder="Height"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label htmlFor="product-unit" className="mb-2 block text-xs font-semibold text-[var(--color-heading)]">
                    Measurement unit
                  </label>
                  <select
                    id="product-unit"
                    name="unit"
                    value={configuration.unit}
                    onChange={updateConfiguration}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="mm">Millimetres</option>
                    <option value="cm">Centimetres</option>
                    <option value="inch">Inches</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="product-material" className="mb-2 block text-xs font-semibold text-[var(--color-heading)]">
                    Material
                  </label>
                  <select
                    id="product-material"
                    name="material"
                    value={configuration.material}
                    onChange={updateConfiguration}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="">Select material</option>
                    {materials.map((material) => {
                      const value =
  typeof material === 'string'
    ? material
    : material.name || material.value || material.label;

const label =
  typeof material === 'string'
    ? material
    : material.label || material.name || material.value;

                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="product-orientation" className="mb-2 block text-xs font-semibold text-[var(--color-heading)]">
                    Orientation
                  </label>
                  <select
                    id="product-orientation"
                    name="orientation"
                    value={configuration.orientation}
                    onChange={updateConfiguration}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="product-quantity" className="mb-2 block text-xs font-semibold text-[var(--color-heading)]">
                    Quantity
                  </label>
                  <input
                    id="product-quantity"
                    name="quantity"
                    type="number"
                    min={options.minimumQuantity || 1}
                    max={options.maximumQuantity || undefined}
                    value={configuration.quantity}
                    onChange={updateConfiguration}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3 text-sm outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              {actionError && (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                  {actionError}
                </p>
              )}

              <button
                type="button"
                onClick={handleCalculate}
                disabled={calculating}
                className="mt-5 w-full rounded-xl border border-[var(--color-primary)] px-5 py-3 text-sm font-bold text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/5 disabled:opacity-60"
              >
                {calculating ? 'Calculating...' : 'Calculate price'}
              </button>

              {quote && (
                <div className="mt-4 rounded-xl bg-[var(--color-surface-soft)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-muted)]">
                      Estimated total
                    </span>
                    <span className="text-xl font-extrabold text-[var(--color-heading)]">
                      {formatMoney(
                        quote.total ?? quote.totalAmount,
                        quote.currency || product.currency || 'INR'
                      )}
                    </span>
                  </div>

                  {quote.discount != null && (
                    <p className="mt-2 text-xs text-[var(--color-muted)]">
                      Discount: {formatMoney(quote.discount, quote.currency || 'INR')}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!onAddToCart}
                    className="mt-4 w-full rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
                  >
                    Add configured product to cart
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
