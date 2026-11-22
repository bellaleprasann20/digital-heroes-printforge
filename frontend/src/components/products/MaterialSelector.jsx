
import React from 'react';

export default function MaterialSelector({
  materials = [],
  selectedMaterial = '',
  onMaterialChange,
  finishes = [],
  selectedFinish = '',
  onFinishChange,
}) {
  return (
    <section className="space-y-6">
      <div>
        <div className="mb-3">
          <h3 className="text-sm font-bold text-[var(--color-heading)]">
            Select material
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            Choose the material for your product.
          </p>
        </div>

        {materials.length === 0 ? (
          <p className="rounded-lg bg-[var(--color-background)] p-4 text-sm text-[var(--color-muted)]">
            No material options have been configured for this product yet.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {materials.map((material) => {
              const value = typeof material === 'string' ? material : material.value;
              const label = typeof material === 'string' ? material : material.label;
              const description = typeof material === 'object' ? material.description : '';
              const disabled = typeof material === 'object' && material.available === false;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onMaterialChange?.(value)}
                  className={[
                    'rounded-xl border p-4 text-left transition-all',
                    selectedMaterial === value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]'
                      : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]',
                    disabled ? 'cursor-not-allowed opacity-40' : '',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-[var(--color-heading)]">
                      {label}
                    </span>
                    <span
                      className={[
                        'flex h-5 w-5 items-center justify-center rounded-full border text-xs',
                        selectedMaterial === value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                          : 'border-[var(--color-border)] text-transparent',
                      ].join(' ')}
                    >
                      ✓
                    </span>
                  </div>

                  {description && (
                    <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                      {description}
                    </p>
                  )}

                  {disabled && (
                    <p className="mt-2 text-[10px] font-bold text-red-500">
                      Currently unavailable
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {finishes.length > 0 && (
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[var(--color-heading)]">
              Select finish
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Choose your preferred finish, if available.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {finishes.map((finish) => {
              const value = typeof finish === 'string' ? finish : finish.value;
              const label = typeof finish === 'string' ? finish : finish.label;
              const disabled = typeof finish === 'object' && finish.available === false;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  onClick={() => onFinishChange?.(value)}
                  className={[
                    'rounded-full border px-4 py-2.5 text-xs font-bold transition-all',
                    selectedFinish === value
                      ? 'border-[var(--color-heading)] bg-[var(--color-heading)] text-white'
                      : 'border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-primary)]',
                    disabled ? 'cursor-not-allowed opacity-40' : '',
                  ].join(' ')}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
