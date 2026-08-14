import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function PremiumBanner() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-bmw-lg)] bg-espresso px-8 py-16 sm:py-20 text-center flex flex-col items-center gap-5">
          <div className="absolute inset-0 bmw-lattice-divider opacity-10" aria-hidden="true" />
          <span className="relative tracking-label text-xs uppercase text-gold-light">
            The Edit
          </span>
          <h2 className="relative font-display text-3xl sm:text-4xl md:text-5xl text-ivory font-medium max-w-2xl text-balance">
            Occasion wear, tailored for grace
          </h2>
          <Button as={Link} to="/shop?filter=occasion" variant="outlineLight" size="lg" className="relative">
            Shop the Edit
          </Button>
        </div>
      </Container>
    </section>
  );
}
