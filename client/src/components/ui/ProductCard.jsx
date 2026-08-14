import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import PriceDisplay from './PriceDisplay';
import { cn } from '@/utils/cn';

export default function ProductCard({ product, onToggleWishlist, isWishlisted = false, className }) {
    const { slug, name, price, salePrice, image, isNew, isBestseller, inStock = true } = product;

    return (
        <Card as="article" padding="none" hoverable className={cn('group overflow-hidden flex flex-col', className)}>
            <div className="relative aspect-[3/4] bg-cream overflow-hidden">
                <Link to={`/product/${slug}`} className="block w-full h-full">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-luxury)] group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-beige to-cream" aria-hidden="true" />
                    )}
                </Link>

                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {isNew && <Badge tone="emerald">New</Badge>}
                    {isBestseller && <Badge tone="gold">Bestseller</Badge>}
                    {!inStock && <Badge tone="neutral">Out of Stock</Badge>}
                </div>

                {onToggleWishlist && (
                    <button
                        type="button"
                        onClick={() => onToggleWishlist(product)}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                        aria-pressed={isWishlisted}
                        className="absolute top-3 right-3 p-2 rounded-full bg-ivory/90 hover:bg-ivory transition-colors"
                    >
                        <Heart
                            className={cn('h-4 w-4', isWishlisted ? 'fill-maroon text-maroon' : 'text-espresso')}
                            strokeWidth={1.5}
                        />
                    </button>
                )}
            </div>

            <Link to={`/product/${slug}`} className="flex flex-col gap-1.5 p-4">
                <h3 className="font-body text-sm text-ink-soft group-hover:text-gold-dark transition-colors line-clamp-1">
                    {name}
                </h3>
                <PriceDisplay price={price} salePrice={salePrice} size="sm" />
            </Link>
        </Card>
    );
}