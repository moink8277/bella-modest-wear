import { cn } from '@/utils/cn';

export default function Loader({ className, label = 'Loading' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)} role="status" aria-live="polite">
      <div className="h-9 w-9 border-2 border-beige border-t-gold rounded-full animate-spin" />
      <span className="text-xs uppercase tracking-label text-muted">{label}</span>
    </div>
  );
}
