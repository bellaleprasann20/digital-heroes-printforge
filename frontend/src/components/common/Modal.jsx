
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-6xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  className = '',
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/55 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={[
          'relative my-auto w-full overflow-hidden rounded-2xl',
          'border border-[var(--color-border)] bg-white shadow-2xl',
          'animate-fade-in',
          sizes[size] || sizes.md,
          className,
        ].join(' ')}
      >
        {(title || showCloseButton) && (
          <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-6 py-5">
            <div className="min-w-0">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-bold tracking-tight text-[var(--color-heading)]"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-[var(--color-text)]">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-heading)]"
              >
                ×
              </button>
            )}
          </header>
        )}

        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>

        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--color-border)] bg-[#fcfbf9] px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>,
    document.body
  );
}
