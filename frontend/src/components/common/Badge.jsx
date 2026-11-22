
import React from 'react';

const variants = {
  primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]',
  success: 'bg-[#e7f5ed] text-[#25845b]',
  warning: 'bg-[#fff4dc] text-[#a87519]',
  danger: 'bg-[#fdeaea] text-[#c43c3c]',
  info: 'bg-[#eaf2fa] text-[#477da8]',
  neutral: 'bg-[#f0efec] text-[#626963]',
  dark: 'bg-[var(--color-heading)] text-white',
};

const dots = {
  primary: 'bg-[var(--color-primary)]',
  success: 'bg-[#25845b]',
  warning: 'bg-[#d99a35]',
  danger: 'bg-[#d94c4c]',
  info: 'bg-[#477da8]',
  neutral: 'bg-[#929891]',
  dark: 'bg-white',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-[11px]',
    lg: 'px-3 py-1.5 text-xs',
  };

  return (
    <span
      className={[
        'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full font-bold',
        'leading-tight',
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${dots[variant] || dots.neutral}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
