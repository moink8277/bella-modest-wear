import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

const Select = forwardRef(function Select(
    { label, error, hint, options = [], placeholder, className, id, ...props },
    ref
) {
    const autoId = useId();
    const selectId = id || autoId;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label htmlFor={selectId} className="text-xs uppercase tracking-label text-ink-soft">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    ref={ref}
                    id={selectId}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
                    className={cn(
                        'w-full appearance-none bg-white border border-border rounded-[var(--radius-bmw)] px-4 py-3 pr-10 text-sm text-ink',
                        'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40',
                        'transition-colors duration-200 cursor-pointer',
                        error && 'border-maroon focus:border-maroon focus:ring-maroon/30',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none"
                    aria-hidden="true"
                />
            </div>

            {error && (
                <p id={`${selectId}-error`} className="text-xs text-maroon">
                    {error}
                </p>
            )}
            {!error && hint && (
                <p id={`${selectId}-hint`} className="text-xs text-muted">
                    {hint}
                </p>
            )}
        </div>
    );
});

export default Select;