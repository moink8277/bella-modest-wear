import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

const Textarea = forwardRef(function Textarea(
    { label, error, hint, rows = 4, className, id, ...props },
    ref
) {
    const autoId = useId();
    const textareaId = id || autoId;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={textareaId} className="text-xs uppercase tracking-label text-ink-soft">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                aria-invalid={!!error}
                aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
                className={cn(
                    'w-full bg-white border border-border rounded-[var(--radius-bmw)] px-4 py-3 text-sm text-ink resize-y',
                    'placeholder:text-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40',
                    'transition-colors duration-200',
                    error && 'border-maroon focus:border-maroon focus:ring-maroon/30',
                    className
                )}
                {...props}
            />
            {error && (
                <p id={`${textareaId}-error`} className="text-xs text-maroon">
                    {error}
                </p>
            )}
            {!error && hint && (
                <p id={`${textareaId}-hint`} className="text-xs text-muted">
                    {hint}
                </p>
            )}
        </div>
    );
});

export default Textarea;