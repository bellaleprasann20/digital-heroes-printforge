
import React from 'react';

export default function QuantitySelector({
  value = 1,
  onChange,
  min = 1,
  max = 100000,
  step = 1,
  presets = [50, 100, 250, 500, 1000],
}) {
  const quantity = Number(value);
  const validQuantity = Number.isFinite(quantity) ? quantity : min;

  const updateQuantity = (nextValue) => {
    if (nextValue === '') {
      onChange?.('');
      return;
    }

    const parsed = Number(nextValue);

    if (!Number.isFinite(parsed)) return;

    const bounded = Math.min(max, Math.max(min, parsed));
    onChange?.(bounded);
  };

  const decrease = () => {
    updateQuantity(validQuantity - step);
  };

  const increase = () => {
    updateQuantity(validQuantity + step);
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[var(--color-heading)]">
            Quantity
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Choose how many units you need.
          </p>
        </div>
        <span className="text-xs text-[var(--color-muted)]">
          Min. {min}
        </span>
      </div>

      <div className="flex max-w-xs items-center rounded-xl border border-[var(--color-border)] bg-white p-1.5">
        <button
          type="button"
          onClick={decrease}
          disabled={validQuantity <= min}
          aria-label="Decrease quantity"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-xl font-semibold text-[var(--color-heading)] transition-colors hover:bg-[var(--color-surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>

        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => updateQuantity(event.target.value)}
          aria-label="Product quantity"
          className="h-11 min-w-0 flex-1 bg-transparent text-center text-lg font-extrabold text-[var(--color-heading)] outline-none"
        />

        <button
          type="button"
          onClick={increase}
          disabled={validQuantity >= max}
          aria-label="Increase quantity"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-xl font-semibold text-[var(--color-heading)] transition-colors hover:bg-[var(--color-surface-soft)] disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>

      <p className="mt-2 text-[10px] text-[var(--color-muted)]">
        Allowed quantity: {min.toLocaleString('en-IN')}–{max.toLocaleString('en-IN')}
      </p>

      {presets.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
            Popular quantities
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={preset < min || preset > max}
                onClick={() => updateQuantity(preset)}
                className={[
                  'rounded-full border px-3 py-2 text-xs font-bold transition-colors',
                  Number(value) === preset
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]',
                  preset < min || preset > max
                    ? 'cursor-not-allowed opacity-30'
                    : '',
                ].join(' ')}
              >
                {preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
