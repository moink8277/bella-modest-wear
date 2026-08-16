import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Layers3,
    BookOpen,
    Crown,
    Gem,
    Heart,
    Moon,
    Shirt,
    Sparkles,
    Star,
} from 'lucide-react';

import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import SEO from '@/components/common/SEO';
import { useFetch } from '@/hooks/useFetch';
import { getCategories } from '@/services/categoryService';

const CATEGORY_ICONS = {
    abayas: Crown,
    hijabs: Layers3,
    khimars: Moon,
    jilbabs: Shirt,
    'modest-dresses': Sparkles,
    kurtis: Gem,
    kaftans: Star,
    'prayer-wear': BookOpen,
    accessories: Heart,
};

function getCategoryIcon(slug) {
    return CATEGORY_ICONS[slug] || Layers3;
}

function CategoryCard({ category, index }) {
    const Icon = getCategoryIcon(category.slug);
    const subcategories = Array.isArray(category.subcategories)
        ? category.subcategories
        : [];

    return (
        <article
            className={`group relative overflow-hidden border border-border bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-bmw-lg ${index === 0 ? 'md:row-span-2' : ''
                }`}
        >
            <div
                className={`relative flex min-h-[280px] flex-col justify-between p-6 sm:p-8 ${index === 0 ? 'md:min-h-[590px]' : ''
                    }`}
            >
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-gold/20 transition-transform duration-700 group-hover:scale-150" />

                <div className="relative z-10 flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center border border-gold/30 bg-cream text-gold-dark transition-colors duration-300 group-hover:bg-espresso group-hover:text-gold-light">
                        <Icon size={19} strokeWidth={1.4} />
                    </span>

                    <span className="font-display text-4xl text-beige/70 transition-colors duration-300 group-hover:text-gold/30">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                <div className="relative z-10 mt-auto pt-16">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-gold-dark">
                        Bella Collection
                    </p>

                    <h2 className="font-display text-3xl text-espresso sm:text-4xl">
                        {category.name}
                    </h2>

                    {subcategories.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                            {subcategories.map((subcategory) => (
                                <span
                                    key={
                                        subcategory.id ||
                                        subcategory.slug ||
                                        subcategory.name
                                    }
                                    className="text-xs text-muted"
                                >
                                    {subcategory.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <Link
                        to={`/shop?category=${encodeURIComponent(
                            category.slug
                        )}`}
                        className="mt-6 inline-flex items-center gap-2 border-b border-gold-dark pb-1 text-[11px] uppercase tracking-[0.18em] text-espresso transition-all duration-300 hover:gap-3 hover:text-gold-dark"
                    >
                        Explore Collection
                        <ArrowRight size={14} strokeWidth={1.5} />
                    </Link>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
        </article>
    );
}

export default function Categories() {
    const fetchCategories = useCallback(() => getCategories(), []);

    const {
        data: categoriesRes,
        isLoading,
        error,
        refetch,
    } = useFetch(fetchCategories);

    const categories = categoriesRes?.data || [];

    return (
        <>
            <SEO
                title="Collections"
                description="Explore Bella Modest Wear's premium modest-fashion collections, from abayas and hijabs to prayer wear and elegant everyday pieces."
                path="/categories"
            />

            <section className="bg-cream">
                <Container className="py-10 sm:py-14">
                    <Breadcrumb
                        items={[{ label: 'Categories' }]}
                        className="mb-8"
                    />

                    <div className="mx-auto max-w-3xl text-center">
                        <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold-dark">
                            The Bella Edit
                        </p>

                        <h1 className="font-display text-4xl leading-tight text-espresso sm:text-5xl lg:text-6xl">
                            Explore Our Collections
                        </h1>

                        <div className="mx-auto my-6 h-px w-16 bg-gold" />

                        <p className="mx-auto max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
                            Discover thoughtfully curated modest wear designed
                            with timeless elegance, graceful silhouettes, and
                            the spirit of modern Islamic fashion.
                        </p>
                    </div>
                </Container>
            </section>

            <section className="bg-ivory">
                <Container className="py-12 sm:py-16 lg:py-20">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className={`min-h-[280px] ${index === 0
                                            ? 'md:row-span-2 md:min-h-[590px]'
                                            : ''
                                        }`}
                                />
                            ))}
                        </div>
                    ) : error ? (
                        <ErrorState
                            message={error.message}
                            onRetry={refetch}
                        />
                    ) : categories.length === 0 ? (
                        <EmptyState
                            icon={Layers3}
                            title="No collections available"
                            description="Our collections are being prepared. Please check back soon."
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {categories.map((category, index) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        index={index}
                                    />
                                ))}
                            </div>

                            <div className="mt-14 flex flex-col items-center text-center">
                                <span className="mb-3 text-[10px] uppercase tracking-[0.25em] text-gold-dark">
                                    Curated For You
                                </span>

                                <p className="max-w-xl font-display text-2xl text-espresso sm:text-3xl">
                                    Modesty, elegance, and effortless grace —
                                    all in one place.
                                </p>

                                <Link
                                    to="/shop"
                                    className="mt-6 inline-flex items-center gap-3 bg-espresso px-7 py-3.5 text-[11px] uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-maroon"
                                >
                                    Shop All Pieces
                                    <ArrowRight size={15} strokeWidth={1.5} />
                                </Link>
                            </div>
                        </>
                    )}
                </Container>
            </section>
        </>
    );
}