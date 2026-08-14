import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const WIDTHS = {
    sm: 'max-w-xs',
    md: 'max-w-sm',
    lg: 'max-w-md',
};

export default function Drawer({ open, onClose, title, side = 'right', size = 'md', children, footer }) {
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, onClose]);

    const offscreenX = side === 'right' ? '100%' : '-100%';

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[90]">
                    <motion.div
                        className="absolute inset-0 bg-espresso/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? 'drawer-title' : undefined}
                        initial={{ x: offscreenX }}
                        animate={{ x: 0 }}
                        exit={{ x: offscreenX }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            'absolute top-0 h-full w-full bg-ivory shadow-[var(--shadow-bmw-lg)] flex flex-col',
                            side === 'right' ? 'right-0' : 'left-0',
                            WIDTHS[size]
                        )}
                    >
                        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
                            {title && (
                                <h2 id="drawer-title" className="font-display text-xl text-espresso">
                                    {title}
                                </h2>
                            )}
                            <button
                                onClick={onClose}
                                aria-label="Close panel"
                                className="p-1 ml-auto text-ink-soft hover:text-espresso"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

                        {footer && <div className="px-6 py-5 border-t border-border shrink-0">{footer}</div>}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}