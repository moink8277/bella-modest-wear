import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function BrandStory() {
  return (
    <section className="py-16 sm:py-24 bg-cream">
      <Container className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-[4/3] rounded-[var(--radius-bmw-lg)] bg-gradient-to-br from-emerald/10 via-beige to-gold-light/30" />
        <div className="flex flex-col gap-5">
          <span className="tracking-label text-xs uppercase text-gold-dark">Our Story</span>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-espresso text-balance">
            Heritage stitched into every silhouette
          </h2>
          <p className="text-ink-soft leading-relaxed">
            Bella Modest Wear was founded on the belief that modesty and modernity
            are not opposites — they are companions. Drawing from Arabian
            craftsmanship, Pakistani textile artistry and Indo-Islamic
            design language, each piece is created for women who dress with
            intention.
          </p>
          <Button as={Link} to="/about" variant="outline" size="md" className="w-fit">
            Read Our Story
          </Button>
        </div>
      </Container>
    </section>
  );
}
