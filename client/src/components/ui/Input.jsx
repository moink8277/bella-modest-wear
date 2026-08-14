import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/**
 * Accessible labelled text input with error state support.
 */
const Input = forwardRef(function Input(
  { label, error, hint, className, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs uppercase tracking-label text-ink-soft">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(
          'w-full bg-white border border-border rounded-[var(--radius-bmw)] px-4 py-3 text-sm text-ink',
          'placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40',
          'transition-colors duration-200',
          error && 'border-maroon focus:border-maroon focus:ring-maroon/30',
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-maroon">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
