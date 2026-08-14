import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function StarRating({ value = 0, onChange, max = 5, size = 'md', showValue = false, className }) {
    const [hovered, setHovered] = useState(null);
    const interactive = typeof onChange === 'function';
    const displayValue = hovered ?? value;

    const sizeClass = { sm: 'h-3.5 w-3.5', md: 'h-[18px] w-[18px]', lg: 'h-6 w-6' }[size];

    return (
        <div
            className={cn('inline-flex items-center gap-1', className)}
            role={interactive ? 'radiogroup' : 'img'}
            aria-label={interactive ? 'Rate this product' : `Rated ${value} out of ${max} stars`}
        >
            {Array.from({ length: max }, (_, i) => {
                const starValue = i + 1;
                const filled = starValue <= Math.round(displayValue);

                const star = (
                    <Star
                        className={cn(sizeClass, filled ? 'fill-gold text-gold' : 'fill-transparent text-border')}
                        strokeWidth={1.5}
                    />
                );

                if (!interactive) {
                    return <span key={starValue}>{star}</span>;
                }

                return (
                    <button
                        key={starValue}
                        type="button"
                        role="radio"
                        aria-checked={starValue === value}
                        aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
                        onMouseEnter={() => setHovered(starValue)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onChange(starValue)}
                        className="p-0.5"
                    >
                        {star}
                    </button>
                );
            })}
            {showValue && <span className="text-xs text-muted ml-1">({value.toFixed(1)})</span>}
        </div>
    );
}