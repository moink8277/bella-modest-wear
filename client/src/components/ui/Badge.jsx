import { cn } from '@/utils/cn';

const TONES = {
  gold: 'bg-gold/15 text-gold-dark border-gold/30',
  emerald: 'bg-emerald/10 text-emerald border-emerald/25',
  maroon: 'bg-maroon/10 text-maroon border-maroon/25',
  neutral: 'bg-beige/60 text-ink-soft border-border',
};

export default function Badge({ tone = 'neutral', children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--radius-bmw)] border px-2.5 py-1 text-[10px] uppercase tracking-label font-body',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
