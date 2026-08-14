import { useId } from 'react';
import { cn } from '@/utils/cn';

export default function RadioGroup({ label, options = [], value, onChange, name, className }) {
    const autoName = useId();
    const groupName = name || autoName;

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            {label && <span className="text-xs uppercase tracking-label text-ink-soft">{label}</span>}
            <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
                {options.map((opt) => {
                    const checked = value === opt.value;
                    return (
                        <label key={opt.value}>
                            <input
                                type="radio"
                                name={groupName}
                                value={opt.value}
                                checked={checked}
                                onChange={() => onChange?.(opt.value)}
                                className="sr-only peer"
                            />
                            <span
                                className={cn(
                                    'inline-flex items-center justify-center min-w-[44px] px-3 py-2 text-xs uppercase tracking-label',
                                    'border rounded-[var(--radius-bmw)] cursor-pointer transition-colors duration-150 select-none',
                                    checked
                                        ? 'bg-espresso text-ivory border-espresso'
                                        : 'bg-white text-ink-soft border-border hover:border-gold',
                                    'peer-focus-visible:ring-2 peer-focus-visible:ring-gold/50 peer-focus-visible:ring-offset-1'
                                )}
                            >
                                {opt.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}