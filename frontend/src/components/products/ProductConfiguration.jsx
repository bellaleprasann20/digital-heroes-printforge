
import React, { useEffect, useMemo, useState } from 'react';
import SizeSelector from './SizeSelector';
import MaterialSelector from './MaterialSelector';
import QuantitySelector from './QuantitySelector';
import PriceSummary from './PriceSummary';

export default function ProductConfiguration({
  product,
  pricing = null,
  pricingLoading = false,
  pricingError = null,
  onConfigurationChange,
  onCalculatePrice,
  onContinue,
}) {
  const options = product?.configuration || {};

  const [selectedSize, setSelectedSize] = useState(
    options.sizes?.[0]?.value || options.sizes?.[0] || ''
  );
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState(options.defaultUnit || 'mm');
  const [orientation, setOrientation] = useState('landscape');
  const [selectedMaterial, setSelectedMaterial] = useState(
    options.materials?.[0]?.value || options.materials?.[0] || ''
  );
  const [selectedFinish, setSelectedFinish] = useState(
    options.finishes?.[0]?.value || options.finishes?.[0] || ''
  );
  const [quantity, setQuantity] = useState(options.minimumQuantity || 1);

  const configuration = useMemo(() => ({
    productId: product?.id || product?._id,
    size: selectedSize,
    dimensions: selectedSize === 'custom'
      ? {
          width: width === '' ? null : Number(width),
          height: height === '' ? null : Number(height),
          unit,
        }
      : null,
    orientation,
    material: selectedMaterial,
    finish: selectedFinish,
    quantity: Number(quantity),
  }), [
    product,
    selectedSize,
    width,
    height,
    unit,
    orientation,
    selectedMaterial,
    selectedFinish,
    quantity,
  ]);

  const isValid = useMemo(() => {
    if (!product || !selectedSize || !selectedMaterial) return false;

    if (selectedSize === 'custom') {
      const minWidth = options.minWidth ?? 1;
      const maxWidth = options.maxWidth ?? 10000;
      const minHeight = options.minHeight ?? 1;
      const maxHeight = options.maxHeight ?? 10000;

      const numericWidth = Number(width);
      const numericHeight = Number(height);

      if (
        !Number.isFinite(numericWidth) ||
        !Number.isFinite(numericHeight) ||
        numericWidth < minWidth ||
        numericWidth > maxWidth ||
        numericHeight < minHeight ||
        numericHeight > maxHeight
      ) {
        return false;
      }
    }

    const minQuantity = options.minimumQuantity ?? 1;
    const maxQuantity = options.maximumQuantity ?? 100000;
    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity < minQuantity ||
      numericQuantity > maxQuantity
    ) {
      return false;
    }

    return true;
  }, [
    product,
    selectedSize,
    selectedMaterial,
    width,
    height,
    quantity,
    options,
  ]);

  useEffect(() => {
    onConfigurationChange?.(configuration, isValid);
  }, [configuration, isValid, onConfigurationChange]);

  useEffect(() => {
    if (isValid) {
      onCalculatePrice?.(configuration);
    }
  }, [configuration, isValid, onCalculatePrice]);

  const handleContinue = () => {
    if (!isValid || pricingLoading || !pricing || pricing.total == null) return;
    onContinue?.(configuration, pricing);
  };

  if (!product) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-8 text-center">
        <h3 className="font-bold text-[var(--color-heading)]">
          Product not found
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Please select a valid product before configuring your order.
        </p>
      </div>
    );
  }

  const sizes = options.sizes || [];
  const materials = options.materials || [];
  const finishes = options.finishes || [];

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="space-y-7">
        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {product.imageUrl || product.image ? (
              <img
                src={product.imageUrl || product.image}
                alt={product.name || 'Selected print product'}
                className="h-24 w-24 rounded-xl bg-[var(--color-surface-soft)] object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-[var(--color-surface-soft)] text-4xl text-[#b7afa3]">
                ◇
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                Product configuration
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-[var(--color-heading)]">
                {product.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-text)]">
                Customize your product to match your requirements.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-sm font-extrabold text-[var(--color-primary-dark)]">
              01
            </span>
            <div>
              <h3 className="font-bold text-[var(--color-heading)]">
                Size & dimensions
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Choose the size that works for you.
              </p>
            </div>
          </div>

          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
            width={width}
            height={height}
            onWidthChange={setWidth}
            onHeightChange={setHeight}
            unit={unit}
            onUnitChange={setUnit}
            units={options.units || ['mm', 'cm', 'inch']}
            minWidth={options.minWidth ?? 1}
            maxWidth={options.maxWidth ?? 10000}
            minHeight={options.minHeight ?? 1}
            maxHeight={options.maxHeight ?? 10000}
            allowCustom={options.allowCustomSize !== false}
            orientation={orientation}
            onOrientationChange={setOrientation}
            allowOrientation={options.allowOrientation !== false}
          />
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-sm font-extrabold text-[var(--color-primary-dark)]">
              02
            </span>
            <div>
              <h3 className="font-bold text-[var(--color-heading)]">
                Material & finish
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Select your preferred product specifications.
              </p>
            </div>
          </div>

          <MaterialSelector
            materials={materials}
            selectedMaterial={selectedMaterial}
            onMaterialChange={setSelectedMaterial}
            finishes={finishes}
            selectedFinish={selectedFinish}
            onFinishChange={setSelectedFinish}
          />
        </section>

        <section className="rounded-2xl border border-[var(--color-border)] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary-light)] text-sm font-extrabold text-[var(--color-primary-dark)]">
              03
            </span>
            <div>
              <h3 className="font-bold text-[var(--color-heading)]">
                Order quantity
              </h3>
              <p className="text-xs text-[var(--color-muted)]">
                Larger orders may qualify for volume discounts.
              </p>
            </div>
          </div>

          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={options.minimumQuantity ?? 1}
            max={options.maximumQuantity ?? 100000}
            step={options.quantityStep ?? 1}
            presets={options.quantityPresets || [50, 100, 250, 500, 1000]}
          />
        </section>

        {!isValid && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">
            Complete all required selections and enter valid dimensions and quantity to continue.
          </p>
        )}
      </div>

      <div className="lg:sticky lg:top-24">
        <PriceSummary
          pricing={pricing}
          loading={pricingLoading}
          error={pricingError}
          quantity={quantity}
          onContinue={handleContinue}
          disabled={!isValid || pricingLoading || !pricing || pricing.total == null}
        />
        <p className="mt-3 text-center text-[10px] leading-5 text-[var(--color-muted)]">
          Your final order amount will be verified by the server before checkout.
        </p>
      </div>
    </div>
  );
}
