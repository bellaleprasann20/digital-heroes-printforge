
import React from 'react';

export default function Loader({
  size = 'md',
  label = 'Loading...',
  fullScreen = false,
  overlay = false,
  className = '',
}) {
  const sizes = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-11 w-11 border-4',
    xl: 'h-14 w-14 border-4',
  };

  const spinner = (
    <div
      className={[
        'animate-spin rounded-full border-[var(--color-primary)] border-r-transparent',
        sizes[size] || sizes.md,
      ].join(' ')}
      role="status"
      aria-label={label}
    />
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[90] flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-background)] ${className}`}
      >
        {spinner}
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/85 backdrop-blur-sm ${className}`}
      >
        {spinner}
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}>
      {spinner}
      {label && (
        <p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
      )}
    </div>
  );
}
