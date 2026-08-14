import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, User, Heart, ShoppingBag } from 'lucide-react';
import Container from '@/components/ui/Container';
import MobileDrawer from './MobileDrawer';
import { cn } from '@/utils/cn';

const CATEGORY_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Lookbook', to: '/lookbook' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 bg-ivory/95 backdrop-blur border-b transition-shadow',
        scrolled ? 'border-border shadow-[var(--shadow-bmw)]' : 'border-transparent'
      )}
    >
      <Container className="flex items-center justify-between h-[76px]">
        {/* Mobile: hamburger */}
        <button
          className="lg:hidden p-2 -ml-2"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-espresso" />
        </button>

        <Link to="/" className="font-display text-2xl sm:text-3xl text-espresso tracking-wide">
          Bella Modest Wear
        </Link>

        {/* Desktop category nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {CATEGORY_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'text-xs uppercase tracking-label text-ink-soft hover:text-gold-dark transition-colors',
                  isActive && 'text-gold-dark'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button className="p-2 hidden sm:inline-flex" aria-label="Search">
            <Search className="h-5 w-5 text-espresso" strokeWidth={1.5} />
          </button>
          <Link to="/login" className="p-2 hidden sm:inline-flex" aria-label="Account">
            <User className="h-5 w-5 text-espresso" strokeWidth={1.5} />
          </Link>
          <Link to="/wishlist" className="p-2 relative" aria-label="Wishlist">
            <Heart className="h-5 w-5 text-espresso" strokeWidth={1.5} />
          </Link>
          <Link to="/cart" className="p-2 relative" aria-label="Cart">
            <ShoppingBag className="h-5 w-5 text-espresso" strokeWidth={1.5} />
          </Link>
        </div>
      </Container>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
