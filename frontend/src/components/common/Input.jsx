
import React, { useId, useState } from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  readOnly = false,
  leftIcon,
  rightElement,
  className = '',
  inputClassName = '',
  id,
  as = 'input',
  rows = 4,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;
  const Field = as === 'textarea' ? 'textarea' : 'input';

  const fieldClasses = [
    'block w-full rounded-lg border bg-white px-4 py-3',
    'text-sm text-[var(--color-heading)] placeholder:text-[#a6aaa5]',
    'outline-none transition-all duration-200',
    'focus:border-[var(--color-primary)] focus:ring-4',
    'focus:ring-[rgba(232,117,53,0.12)]',
    'disabled:cursor-not-allowed disabled:bg-[#f5f4f1] disabled:opacity-70',
    'read-only:bg-[#f8f7f4]',
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
      : 'border-[var(--color-border)]',
    as === 'textarea' ? 'min-h-28 resize-y' : 'min-h-12',
    leftIcon ? 'pl-11' : '',
    isPassword || rightElement ? 'pr-12' : '',
    inputClassName,
  ].join(' ');

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-bold text-[var(--color-heading)]"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[var(--color-muted)]">
            {leftIcon}
          </span>
        )}

        <Field
          id={inputId}
          name={name}
          type={Field === 'input' ? resolvedType : undefined}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          rows={Field === 'textarea' ? rows : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={fieldClasses}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[var(--color-muted)] transition-colors hover:text-[var(--color-heading)]"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}

        {!isPassword && rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {!error && hint && (
        <p id={hintId} className="text-xs text-[var(--color-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
}
