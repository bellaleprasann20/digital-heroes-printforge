
import React, { useEffect, useState } from 'react';

const divisions = [
  { value: 'labels_stickers', label: 'Labels & Stickers' },
  { value: 'race_numbers', label: 'Race & Event Numbers' },
  { value: 'mtb_boards', label: 'MTB Boards' },
  { value: 'stamps', label: 'Stamps' },
  { value: 'trophies', label: 'Trophies' },
  { value: 'laser_cut', label: 'Laser-cut Work' },
];

const emptyProduct = {
  name: '',
  slug: '',
  category: 'labels_stickers',
  shortDescription: '',
  description: '',
  imageUrl: '',
  startingPrice: '',
  currency: 'INR',
  isActive: true,
  isFeatured: false,
};

const ProductForm = ({
  product = null,
  onSubmit,
  onCancel,
  submitting = false,
  error = null,
  className = '',
}) => {
  const [form, setForm] = useState({
    ...emptyProduct,
    ...(product || {}),
    startingPrice: product?.startingPrice ?? product?.price ?? '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setForm({
      ...emptyProduct,
      ...(product || {}),
      startingPrice: product?.startingPrice ?? product?.price ?? '',
    });
    setValidationErrors({});
  }, [product]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setValidationErrors((current) => ({
      ...current,
      [name]: '',
    }));
  };

  const validate = () => {
    const errors = {};

    if (!form.name.trim()) errors.name = 'Product name is required.';
    if (!form.category) errors.category = 'Choose a division.';
    if (!form.shortDescription.trim()) {
      errors.shortDescription = 'Add a short description.';
    }
    if (
      form.startingPrice === '' ||
      !Number.isFinite(Number(form.startingPrice)) ||
      Number(form.startingPrice) < 0
    ) {
      errors.startingPrice = 'Enter a valid non-negative price.';
    }

    if (form.imageUrl && !/^https?:\/\/.+/i.test(form.imageUrl)) {
      errors.imageUrl = 'Enter a valid image URL.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (submitting || !validate()) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      startingPrice: Number(form.startingPrice),
    };

    onSubmit?.(payload);
  };

  const inputClass =
    'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)]';

  const renderError = (name) =>
    validationErrors[name] ? (
      <p className="mt-1.5 text-xs text-red-600">{validationErrors[name]}</p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 ${className}`}
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          Product management
        </p>
        <h2 className="mt-2 text-xl font-bold text-[var(--color-heading)]">
          {product ? 'Edit product' : 'Add new product'}
        </h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Enter the product information for the storefront.
        </p>
      </div>

      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            Product name *
          </label>
          <input
            id="product-name"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Enter product name"
            className={inputClass}
          />
          {renderError('name')}
        </div>

        <div>
          <label htmlFor="product-slug" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            URL slug
          </label>
          <input
            id="product-slug"
            name="slug"
            value={form.slug}
            onChange={updateField}
            placeholder="product-url-slug"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Leave blank if your backend generates it.
          </p>
        </div>

        <div>
          <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            Product division *
          </label>
          <select
            id="product-category"
            name="category"
            value={form.category}
            onChange={updateField}
            className={inputClass}
          >
            {divisions.map((division) => (
              <option key={division.value} value={division.value}>
                {division.label}
              </option>
            ))}
          </select>
          {renderError('category')}
        </div>

        <div>
          <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            Starting price *
          </label>
          <input
            id="product-price"
            name="startingPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.startingPrice}
            onChange={updateField}
            placeholder="0.00"
            className={inputClass}
          />
          {renderError('startingPrice')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-short-description" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            Short description *
          </label>
          <input
            id="product-short-description"
            name="shortDescription"
            value={form.shortDescription}
            onChange={updateField}
            maxLength={180}
            placeholder="A short description shown on product cards"
            className={inputClass}
          />
          {renderError('shortDescription')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-description" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            Full description
          </label>
          <textarea
            id="product-description"
            name="description"
            value={form.description}
            onChange={updateField}
            rows={5}
            placeholder="Describe the product, available options, materials, and specifications..."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="product-image" className="mb-2 block text-sm font-medium text-[var(--color-heading)]">
            Product image URL
          </label>
          <input
            id="product-image"
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={updateField}
            placeholder="https://example.com/product-image.jpg"
            className={inputClass}
          />
          {renderError('imageUrl')}

          {form.imageUrl && !validationErrors.imageUrl && (
            <div className="mt-3 h-36 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
              <img
                src={form.imageUrl}
                alt="Product preview"
                className="h-full w-full object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 border-t border-[var(--color-border)] pt-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            name="isActive"
            checked={Boolean(form.isActive)}
            onChange={updateField}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          Active product
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text)]">
          <input
            type="checkbox"
            name="isFeatured"
            checked={Boolean(form.isFeatured)}
            onChange={updateField}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          Featured product
        </label>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-heading)] hover:bg-[var(--color-surface-soft)] disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? 'Saving...'
            : product
              ? 'Save changes'
              : 'Create product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
