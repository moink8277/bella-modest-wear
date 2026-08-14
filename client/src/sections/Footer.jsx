import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';
import Container from '@/components/ui/Container';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'Abayas', to: '/shop?category=abayas' },
      { label: 'Hijabs', to: '/shop?category=hijabs' },
      { label: 'Modest Dresses', to: '/shop?category=modest-dresses' },
      { label: 'New Arrivals', to: '/shop?filter=new' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Lookbook', to: '/lookbook' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', to: '/account' },
      { label: 'Orders', to: '/account/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Track Order', to: '/account/orders' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-espresso text-cream mt-24">
      <Container className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="font-display text-2xl text-ivory">Bella Modest Wear</span>
          <p className="text-sm text-cream/70 max-w-xs leading-relaxed">
            Modest luxury inspired by Arabian, Pakistani and Indo-Islamic elegance —
            crafted for the modern woman.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" aria-label="Instagram" className="text-cream/70 hover:text-gold-light transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-cream/70 hover:text-gold-light transition-colors">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="mailto:hello@bellamodestwear.com" aria-label="Email" className="text-cream/70 hover:text-gold-light transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-xs uppercase tracking-label text-gold-light">{col.title}</h3>
            {col.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-cream/70 hover:text-ivory transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-3">
          <h3 className="text-xs uppercase tracking-label text-gold-light">Newsletter</h3>
          <p className="text-sm text-cream/70">Be first to know about new collections.</p>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="Your email"
              aria-label="Email for newsletter"
              className="bg-transparent border-cream/25 text-ivory placeholder:text-cream/40"
              required
            />
            <Button type="submit" variant="gold" size="sm">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>

      <div className="border-t border-cream/10 py-5">
        <Container className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Bella Modest Wear. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-cream">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cream">Terms of Service</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
