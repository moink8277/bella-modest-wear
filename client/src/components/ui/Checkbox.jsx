import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

const Checkbox = forwardRef(function Checkbox({ label, className, id, ...props }, ref) {
    const autoId = useId();
    const checkboxId = id || autoId;

    return (
        <label
            htmlFor={checkboxId}
            className={cn('inline-flex items-center gap-2.5 cursor-pointer select-none group', className)}
        >
            <span className="relative inline-flex shrink-0">
                <input ref={ref} id={checkboxId} type="checkbox" className="peer sr-only" {...props} />
                <span
                    className={cn(
                        'h-[18px] w-[18px] border border-border rounded-[3px] bg-white',
                        'flex items-center justify-center transition-colors duration-150',
                        'peer-checked:bg-espresso peer-checked:border-espresso',
                        'peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 peer-focus-visible:ring-offset-1'
                    )}
                >
                    <Check className="h-3 w-3 text-ivory opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                </span>
            </span>
            {label && <span className="text-sm text-ink-soft group-hover:text-ink transition-colors">{label}</span>}
        </label>
    );
});

export default Checkbox;