import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function QuantitySelector({ value = 1, onChange, min = 1, max = 99, size = 'md', className }) {
    const decrease = () => onChange(Math.max(min, value - 1));
    const increase = () => onChange(Math.min(max, value + 1));

    const sizeClasses = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';

    return (
        <div
            className={cn('inline-flex items-center border border-border rounded-[var(--radius-bmw)] bg-white', className)}
            role="group"
            aria-label="Quantity"
        >
            <button
                type="button"
                onClick={decrease}
                disabled={value <= min}
                aria-label="Decrease quantity"
                className={cn(
                    'flex items-center justify-center text-ink-soft hover:text-espresso disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                    sizeClasses
                )}
            >
                <Minus className="h-3.5 w-3.5" />
            </button>

            <span className="w-8 text-center text-sm text-ink tabular-nums" aria-live="polite">
                {value}
            </span>

            <button
                type="button"
                onClick={increase}
                disabled={value >= max}
                aria-label="Increase quantity"
                className={cn(
                    'flex items-center justify-center text-ink-soft hover:text-espresso disabled:opacity-30 disabled:cursor-not-allowed transition-colors',
                    sizeClasses
                )}
            >
                <Plus className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}