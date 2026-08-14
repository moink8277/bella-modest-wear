import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function MobileDrawer({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-espresso/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="fixed top-0 left-0 h-full w-[82%] max-w-xs bg-ivory z-50 flex flex-col shadow-[var(--shadow-bmw-lg)]"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <span className="font-display text-xl text-espresso">Bella Modest Wear</span>
              <button onClick={onClose} aria-label="Close menu" className="p-1">
                <X className="h-5 w-5 text-espresso" />
              </button>
            </div>
            <nav className="flex flex-col py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className="px-6 py-3.5 text-sm uppercase tracking-label text-ink-soft hover:text-gold-dark hover:bg-cream transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
