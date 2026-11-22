
import React from 'react';

export default function SizeSelector({
  sizes = [],
  selectedSize = '',
  onSizeChange,
  width = '',
  height = '',
  onWidthChange,
  onHeightChange,
  unit = 'mm',
  onUnitChange,
  units = ['mm', 'cm', 'inch'],
  minWidth = 1,
  maxWidth = 10000,
  minHeight = 1,
  maxHeight = 10000,
  allowCustom = true,
  orientation = 'landscape',
  onOrientationChange,
  allowOrientation = true,
}) {
  const isCustom = selectedSize === 'custom';

  return (
    <section className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--color-heading)]">
            Choose your size
          </h3>
          <span className="text-xs text-[var(--color-muted)]">
            Dimensions
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sizes.map((size) => {
            const value = typeof size === 'string' ? size : size.value;
            const label = typeof size === 'string' ? size : size.label;

            return (
              <button
                key={value}
                type="button"
                onClick={() => onSizeChange?.(value)}
                className={[
                  'rounded-xl border px-3 py-3 text-left transition-all',
                  selectedSize === value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]',
                ].join(' ')}
              >
                <span className="block text-sm font-bold text-[var(--color-heading)]">
                  {label}
                </span>
                {typeof size === 'object' && size.description && (
                  <span className="mt-1 block text-[10px] text-[var(--color-muted)]">
                    {size.description}
                  </span>
                )}
              </button>
            );
          })}

          {allowCustom && (
            <button
              type="button"
              onClick={() => onSizeChange?.('custom')}
              className={[
                'rounded-xl border px-3 py-3 text-left transition-all',
                isCustom
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]'
                  : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]',
              ].join(' ')}
            >
              <span className="block text-sm font-bold text-[var(--color-heading)]">
                Custom size
              </span>
              <span className="mt-1 block text-[10px] text-[var(--color-muted)]">
                Enter your dimensions
              </span>
            </button>
          )}
        </div>
      </div>

      {isCustom && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold text-[var(--color-heading)]">
              Custom dimensions
            </h4>

            <select
              aria-label="Dimension unit"
              value={unit}
              onChange={(event) => onUnitChange?.(event.target.value)}
              className="rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-heading)] outline-none focus:border-[var(--color-primary)]"
            >
              {units.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="custom-width"
                className="mb-2 block text-xs font-semibold text-[var(--color-text)]"
              >
                Width ({unit})
              </label>
              <input
                id="custom-width"
                type="number"
                min={minWidth}
                max={maxWidth}
                step="any"
                value={width}
                onChange={(event) => onWidthChange?.(event.target.value)}
                placeholder="Width"
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
              />
              <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                {minWidth}–{maxWidth} {unit}
              </p>
            </div>

            <div>
              <label
                htmlFor="custom-height"
                className="mb-2 block text-xs font-semibold text-[var(--color-text)]"
              >
                Height ({unit})
              </label>
              <input
                id="custom-height"
                type="number"
                min={minHeight}
                max={maxHeight}
                step="any"
                value={height}
                onChange={(event) => onHeightChange?.(event.target.value)}
                placeholder="Height"
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-white px-3 text-sm outline-none focus:border-[var(--color-primary)]"
              />
              <p className="mt-1 text-[10px] text-[var(--color-muted)]">
                {minHeight}–{maxHeight} {unit}
              </p>
            </div>
          </div>
        </div>
      )}

      {allowOrientation && (
        <div>
          <h4 className="mb-3 text-sm font-bold text-[var(--color-heading)]">
            Orientation
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'landscape', label: 'Landscape', symbol: '▰' },
              { value: 'portrait', label: 'Portrait', symbol: '▯' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onOrientationChange?.(item.value)}
                className={[
                  'flex items-center justify-center gap-3 rounded-xl border p-3 text-sm font-semibold transition-all',
                  orientation === item.value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]',
                ].join(' ')}
              >
                <span className="text-xl">{item.symbol}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
