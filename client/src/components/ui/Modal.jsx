import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const SIZES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};

export default function Modal({ open, onClose, title, size = 'md', children, footer }) {
    const dialogRef = useRef(null);

    // Focus the dialog only when it first opens — this must NOT depend on
    // onClose, because onClose is an inline arrow function from the parent
    // and gets a new reference on every parent re-render (e.g. every
    // keystroke in a form inside the modal). If this effect depended on
    // onClose, it would re-run and steal focus back to the dialog container
    // after every single keystroke, which is exactly the bug this fixes.
    useEffect(() => {
        if (!open) return;
        dialogRef.current?.focus();
    }, [open]);

    // Keydown listener + body scroll lock. Safe to depend on onClose here —
    // re-attaching a listener on every render has no visible side effect,
    // unlike stealing focus.
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

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <motion.div
                        className="absolute inset-0 bg-espresso/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        ref={dialogRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? 'modal-title' : undefined}
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                            'relative w-full bg-ivory rounded-[var(--radius-bmw-lg)] shadow-[var(--shadow-bmw-lg)] outline-none',
                            SIZES[size]
                        )}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            {title && (
                                <h2 id="modal-title" className="font-display text-xl text-espresso">
                                    {title}
                                </h2>
                            )}
                            <button
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="p-1 ml-auto text-ink-soft hover:text-espresso"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5">{children}</div>

                        {footer && <div className="px-6 py-4 border-t border-border flex justify-end gap-3">{footer}</div>}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}