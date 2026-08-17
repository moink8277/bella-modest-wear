import { Heart } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import SEO from '@/components/common/SEO';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/context/ToastContext';

export default function Wishlist() {
    const { items, isLoading, error, removeItem } = useWishlist();
    const toast = useToast();

    const handleRemove = async (productId) => {
        const result = await removeItem(productId);
        if (!result.success) {
            toast.error(result.message || 'Could not remove item');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <SEO title="Your Wishlist" path="/account/wishlist" noIndex />

            <h2 className="font-display text-2xl text-espresso">Your Wishlist</h2>

            {isLoading ? (
                <Loader label="Loading your wishlist" />
            ) : error ? (
                <ErrorState message={error} onRetry={() => window.location.reload()} />
            ) : items.length === 0 ? (
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
                            onToggleWishlist={() => handleRemove(product.productId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}