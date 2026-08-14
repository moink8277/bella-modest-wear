import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Hero3D from '@/components/three/Hero3D';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="absolute inset-0 bmw-lattice-divider pointer-events-none" aria-hidden="true" />

      <Container className="relative grid lg:grid-cols-2 gap-10 items-center py-16 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6 order-2 lg:order-1"
        >
          <span className="tracking-label text-xs uppercase text-gold-dark">
            New Season Collection
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-espresso text-balance">
            Modest Luxury,<br /> Redefined.
          </h1>
          <p className="text-ink-soft text-base sm:text-lg max-w-md leading-relaxed">
            Discover abayas, hijabs and modest fashion where Arabian, Pakistani
            and Indo-Islamic heritage meet contemporary craftsmanship.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Button as={Link} to="/shop" variant="primary" size="lg">
              Shop Collection
            </Button>
            <Button as={Link} to="/lookbook" variant="outline" size="lg">
              Explore Lookbook
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 aspect-[4/5] sm:aspect-[5/4] lg:aspect-square"
        >
          <Hero3D className="w-full h-full" />
        </motion.div>
      </Container>
    </section>
  );
}
