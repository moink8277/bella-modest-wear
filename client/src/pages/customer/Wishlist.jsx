import { Heart } from 'lucide-react';
import Container from '@/components/ui/Container';
import ProductCard from '@/components/ui/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import SEO from '@/components/common/SEO';
import { useWishlist } from '@/hooks/useWishlist';

export default function Wishlist() {
    const { items, removeItem } = useWishlist();

    return (
        <Container className="py-12 sm:py-16">
            <SEO title="Your Wishlist" path="/wishlist" noIndex />

            <h1 className="font-display text-3xl sm:text-4xl text-espresso mb-8">Your Wishlist</h1>

            {items.length === 0 ? (
                <EmptyState
                    icon={Heart}
                    title="Your wishlist is empty"
                    description="Save pieces you love while you browse and they'll show up here."
                    actionLabel="Start Shopping"
                    onAction={() => (window.location.href = '/shop')}
                />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {items.map((product) => (
                        <ProductCard
                            key={product.productId}
                            product={product}
                            isWishlisted
                            onToggleWishlist={() => removeItem(product.productId)}
                        />
                    ))}
                </div>
            )}
        </Container>
    );
}