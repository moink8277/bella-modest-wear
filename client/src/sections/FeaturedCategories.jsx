import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { FEATURED_CATEGORIES } from '@/constants/categories';

export default function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Curated For You"
          title="Shop by Category"
          subtitle="Every silhouette, styled with intention."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              className="group flex flex-col gap-3"
            >
              <div className="aspect-[3/4] rounded-[var(--radius-bmw-lg)] bg-gradient-to-br from-beige to-cream overflow-hidden relative">
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/10 transition-colors duration-300" />
              </div>
              <span className="text-xs uppercase tracking-label text-ink-soft group-hover:text-gold-dark transition-colors text-center">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
