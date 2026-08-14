import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Accordion({ items = [], allowMultiple = false, defaultOpen = [], className }) {
    const [openIds, setOpenIds] = useState(new Set(defaultOpen));

    const toggle = (id) => {
        setOpenIds((prev) => {
            const next = new Set(allowMultiple ? prev : []);
            if (prev.has(id)) {
                if (allowMultiple) next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <div className={cn('divide-y divide-border border-t border-b border-border', className)}>
            {items.map((item) => {
                const isOpen = openIds.has(item.id);
                return (
                    <div key={item.id}>
                        <button
                            type="button"
                            onClick={() => toggle(item.id)}
                            aria-expanded={isOpen}
                            aria-controls={`accordion-panel-${item.id}`}
                            className="w-full flex items-center justify-between py-4 text-left"
                        >
                            <span className="text-sm font-medium text-ink">{item.title}</span>
                            <ChevronDown
                                className={cn('h-4 w-4 text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                            />
                        </button>
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    id={`accordion-panel-${item.id}`}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-4 text-sm text-ink-soft leading-relaxed">{item.content}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}