import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

const TONE_CONFIG = {
    success: { icon: CheckCircle2, className: 'border-emerald/30 text-emerald' },
    error: { icon: XCircle, className: 'border-maroon/30 text-maroon' },
    info: { icon: Info, className: 'border-gold/30 text-gold-dark' },
};

export function ToastItem({ id, tone = 'info', message, onDismiss }) {
    const { icon: Icon, className } = TONE_CONFIG[tone];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            className={cn(
                'flex items-center gap-3 bg-white border rounded-[var(--radius-bmw-lg)] shadow-[var(--shadow-bmw-lg)] px-4 py-3 min-w-[280px] max-w-sm',
                className
            )}
        >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-ink flex-1">{message}</p>
            <button
                onClick={() => onDismiss(id)}
                aria-label="Dismiss notification"
                className="text-muted hover:text-ink shrink-0"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
}

export default function ToastViewport({ toasts, onDismiss }) {
    return (
        <div
            className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2"
            aria-live="polite"
            aria-atomic="true"
        >
            <AnimatePresence>
                {toasts.map((t) => (
                    <ToastItem key={t.id} {...t} onDismiss={onDismiss} />
                ))}
            </AnimatePresence>
        </div>
    );
}