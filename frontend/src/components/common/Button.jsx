
import React from 'react';

const variants = {
  primary:
    'bg-[var(--color-primary)] text-white border border-transparent hover:bg-[var(--color-primary-dark)] shadow-sm',
  secondary:
    'bg-white text-[var(--color-heading)] border border-[var(--color-border)] hover:border-[var(--color-heading)] hover:bg-[var(--color-heading)] hover:text-white',
  dark:
    'bg-[var(--color-heading)] text-white border border-transparent hover:bg-[#343d37]',
  outline:
    'bg-transparent text-[var(--color-heading)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]',
  ghost:
    'bg-transparent text-[var(--color-text)] border border-transparent hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-heading)]',
  danger:
    'bg-red-600 text-white border border-transparent hover:bg-red-700',
};

const sizes = {
  xs: 'min-h-8 px-3 text-xs rounded-md',
  sm: 'min-h-9 px-4 text-sm rounded-md',
  md: 'min-h-11 px-5 text-sm rounded-lg',
  lg: 'min-h-12 px-6 text-base rounded-lg',
  xl: 'min-h-14 px-8 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-bold',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-4',
        'focus-visible:ring-[rgba(232,117,53,0.18)]',
        'active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'disabled:active:scale-100',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
          <span>{typeof loading === 'string' ? loading : 'Please wait...'}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
