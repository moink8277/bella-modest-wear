import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Hand, Gem } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SEO from '@/components/common/SEO';

const VALUES = [
    {
        icon: Hand,
        title: 'Handcrafted Detail',
        description:
            'Every embellishment, from zardozi to hand-finished hems, is placed with the same care as a couture atelier.',
    },
    {
        icon: Leaf,
        title: 'Considered Sourcing',
        description:
            'We work with mills across South Asia known for their fabric quality, not the fastest turnaround.',
    },
    {
        icon: Gem,
        title: 'Modern Silhouettes',
        description:
            'Modesty shaped by contemporary tailoring — pieces that move with you, not around you.',
    },
];

export default function About() {
    return (
        <>
            <SEO
                title="About Us"
                path="/about"
                description="The story, values and craftsmanship behind Bella Modest Wear — premium modest fashion inspired by Arabian, Pakistani and Indo-Islamic elegance."
            />

            <section className="relative overflow-hidden bg-espresso py-20 sm:py-28 text-center">
                <div className="absolute inset-0 bmw-lattice-divider opacity-10" aria-hidden="true" />
                <Container className="relative flex flex-col items-center gap-4">
                    <span className="tracking-label text-xs uppercase text-gold-light">
                        <Sparkles className="inline h-3.5 w-3.5 mb-0.5 mr-1.5" strokeWidth={1.5} />
                        Our Story
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory font-medium max-w-3xl text-balance">
                        Modesty and modernity, stitched together
                    </h1>
                </Container>
            </section>

            <section className="py-16 sm:py-24">
                <Container className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="aspect-[4/3] rounded-[var(--radius-bmw-lg)] bg-gradient-to-br from-emerald/10 via-beige to-gold-light/30" />
                    <div className="flex flex-col gap-5">
                        <span className="tracking-label text-xs uppercase text-gold-dark">
                            Where It Began
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-medium text-espresso text-balance">
                            Built on the belief that modest dressing deserves modern craft
                        </h2>
                        <p className="text-ink-soft leading-relaxed">
                            Bella Modest Wear started as a simple question: why should modest
                            fashion feel like an afterthought? We set out to build a house
                            of clothing that draws on Arabian, Pakistani and Indo-Islamic
                            design language, and reworks it through a modern, luxury lens.
                        </p>
                        <p className="text-ink-soft leading-relaxed">
                            Every collection is designed for the woman who wants to dress
                            with intention — covered, considered, and never compromising on
                            elegance.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="py-16 sm:py-24 bg-cream">
                <Container className="flex flex-col gap-12">
                    <div className="flex flex-col items-center text-center gap-3 max-w-xl mx-auto">
                        <span className="tracking-label text-xs uppercase text-gold-dark">
                            What We Stand For
                        </span>
                        <h2 className="font-display text-3xl sm:text-4xl font-medium text-espresso">
                            Our Values
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-8">
                        {VALUES.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="flex flex-col items-center text-center gap-3 px-4">
                                <div className="h-12 w-12 rounded-full bg-white border border-border flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-gold-dark" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-display text-xl text-espresso">{title}</h3>
                                <p className="text-sm text-ink-soft leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            <section className="py-16 sm:py-24">
                <Container>
                    <div className="relative overflow-hidden rounded-[var(--radius-bmw-lg)] bg-espresso px-8 py-16 sm:py-20 text-center flex flex-col items-center gap-5">
                        <div className="absolute inset-0 bmw-lattice-divider opacity-10" aria-hidden="true" />
                        <h2 className="relative font-display text-3xl sm:text-4xl text-ivory font-medium max-w-xl text-balance">
                            Discover the collection
                        </h2>
                        <Button as={Link} to="/shop" variant="outlineLight" size="lg" className="relative">
                            Shop Now
                        </Button>
                    </div>
                </Container>
            </section>
        </>
    );
}