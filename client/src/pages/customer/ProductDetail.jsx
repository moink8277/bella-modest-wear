import { useCallback, useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PackageX, Heart } from 'lucide-react';
import Container from '@/components/ui/Container';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ImageGallery from '@/components/ui/ImageGallery';
import PriceDisplay from '@/components/ui/PriceDisplay';
import RadioGroup from '@/components/ui/RadioGroup';
import QuantitySelector from '@/components/ui/QuantitySelector';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import ProductCard from '@/components/ui/ProductCard';
import SEO from '@/components/common/SEO';
import { useFetch } from '@/hooks/useFetch';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/context/ToastContext';
import { getProductBySlug, getRelatedProducts } from '@/services/productService';
import { cn } from '@/utils/cn';

/** Normalizes the API's snake_case product shape into what ProductCard expects. */
function mapProduct(p) {
    return {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        salePrice: p.sale_price ? Number(p.sale_price) : undefined,
        image: p.image,
        isNew: !!p.is_new,
        isBestseller: !!p.is_bestseller,
        inStock: p.stock_quantity > 0,
    };
}

export default function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const { addItem } = useCart();
    const { isInWishlist, toggleItem } = useWishlist();

    const fetchProduct = useCallback(() => getProductBySlug(slug), [slug]);
    const { data: productRes, isLoading, error, refetch } = useFetch(fetchProduct);
    const product = productRes?.data;

    const fetchRelated = useCallback(() => getRelatedProducts(product.id, 4), [product?.id]);
    const { data: relatedRes } = useFetch(fetchRelated, { skip: !product });
    const relatedProducts = useMemo(
        () => (relatedRes?.data || []).map(mapProduct),
        [relatedRes]
    );

    const variants = product?.variants || [];
    const sizes = useMemo(
        () => [...new Set(variants.map((v) => v.size).filter(Boolean))],
        [variants]
    );
    const colors = useMemo(
        () => [...new Map(variants.filter((v) => v.color).map((v) => [v.color, v])).values()],
        [variants]
    );

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Default to the first available size/color once variants load.
    useEffect(() => {
        if (sizes.length && !selectedSize) setSelectedSize(sizes[0]);
        if (colors.length && !selectedColor) setSelectedColor(colors[0].color);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variants]);

    const selectedVariant = useMemo(() => {
        if (variants.length === 0) return null;
        return (
            variants.find(
                (v) =>
                    (!sizes.length || v.size === selectedSize) &&
                    (!colors.length || v.color === selectedColor)
            ) || null
        );
    }, [variants, sizes, colors, selectedSize, selectedColor]);

    const basePrice = product ? Number(product.price) : 0;
    const baseSalePrice = product?.sale_price ? Number(product.sale_price) : undefined;
    const adjustment = selectedVariant ? Number(selectedVariant.price_adjustment || 0) : 0;
    const effectivePrice = basePrice + adjustment;
    const effectiveSalePrice = baseSalePrice != null ? baseSalePrice + adjustment : undefined;

    const stock = variants.length
        ? selectedVariant?.stock_quantity ?? 0
        : product?.stock_quantity ?? 0;
    const inStock = stock > 0;
    const needsSelection = variants.length > 0 && !selectedVariant;

    const images = product?.images?.length
        ? product.images.map((img) => img.url)
        : [];

    const wishlistProduct = product
        ? mapProduct({ ...product, image: images[0] })
        : null;

    const handleAddToCart = async () => {
        if (!product || !inStock || needsSelection) return;

        const result = await addItem(
            {
                productId: product.id,
                variantId: selectedVariant?.id,
                slug: product.slug,
                name: product.name,
                image: images[0],
                price: basePrice,
                salePrice: baseSalePrice,
                variantLabel: [selectedSize, selectedColor].filter(Boolean).join(' / ') || undefined,
            },
            quantity
        );

        if (result.reason === 'auth') {
            // Guest tried to add to cart — send them to log in first, then
            // bring them right back here, same pattern as other e-commerce sites.
            toast.info('Please log in to add items to your cart');
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!result.success) {
            toast.error(result.message || 'Could not add item to cart');
            return;
        }

        toast.success('Added to cart');
    };

    // Wishlist is guest-friendly (localStorage), unlike cart — no auth-gate
    // reason to check here. toggleItem is async either way (returns a
    // promise for both the guest-local and logged-in-backend paths), so we
    // just await it and surface a toast if the backend call failed.
    const handleToggleWishlist = async (wishlistItem) => {
        if (!wishlistItem) return;
        const result = await toggleItem(wishlistItem);
        if (!result.success) {
            toast.error(result.message || 'Could not update wishlist');
        }
    };

    if (isLoading) {
        return (
            <Container className="py-10 sm:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <Skeleton className="aspect-[3/4] w-full" />
                    <div className="flex flex-col gap-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        if (error.status === 404) {
            return (
                <Container className="py-10 sm:py-14">
                    <EmptyState
                        icon={PackageX}
                        title="Product not found"
                        description="This piece may have sold out or is no longer available."
                        actionLabel="Back to Shop"
                        onAction={() => (window.location.href = '/shop')}
                    />
                </Container>
            );
        }
        return (
            <Container className="py-10 sm:py-14">
                <ErrorState message={error.message} onRetry={refetch} />
            </Container>
        );
    }

    if (!product) return null;

    return (
        <Container className="py-10 sm:py-14">
            <SEO title={product.name} path={`/product/${product.slug}`} image={images[0]} />

            <Breadcrumb items={[{ label: 'Shop', to: '/shop' }, { label: product.name }]} className="mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <ImageGallery images={images} alt={product.name} />

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {product.is_new ? <Badge tone="emerald">New</Badge> : null}
                            {product.is_bestseller ? <Badge tone="gold">Bestseller</Badge> : null}
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl text-espresso">{product.name}</h1>
                        <PriceDisplay price={effectivePrice} salePrice={effectiveSalePrice} size="lg" />
                    </div>

                    {product.description && (
                        <p className="text-sm text-ink-soft leading-relaxed">{product.description}</p>
                    )}

                    {sizes.length > 0 && (
                        <RadioGroup
                            label="Size"
                            options={sizes.map((s) => ({ value: s, label: s }))}
                            value={selectedSize}
                            onChange={setSelectedSize}
                        />
                    )}

                    {colors.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs uppercase tracking-label text-ink-soft">Color</span>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((c) => (
                                    <button
                                        key={c.color}
                                        type="button"
                                        onClick={() => setSelectedColor(c.color)}
                                        aria-label={c.color}
                                        aria-pressed={selectedColor === c.color}
                                        className={cn(
                                            'h-8 w-8 rounded-full border-2 transition-all',
                                            selectedColor === c.color ? 'border-gold-dark scale-110' : 'border-border'
                                        )}
                                        style={{ backgroundColor: c.color_hex || '#ccc' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(stock, 1)} />
                        {!inStock && <Badge tone="neutral">Out of Stock</Badge>}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            size="lg"
                            className="flex-1"
                            disabled={!inStock || needsSelection}
                            onClick={handleAddToCart}
                        >
                            {inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <button
                            type="button"
                            onClick={() => handleToggleWishlist(wishlistProduct)}
                            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                            aria-pressed={isInWishlist(product.id)}
                            className="p-3 rounded-[var(--radius-bmw)] border border-border hover:border-gold transition-colors shrink-0"
                        >
                            <Heart
                                className={cn(
                                    'h-5 w-5',
                                    isInWishlist(product.id) ? 'fill-maroon text-maroon' : 'text-espresso'
                                )}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-16 sm:mt-20">
                    <h2 className="font-display text-2xl sm:text-3xl text-espresso mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                        {relatedProducts.map((p) => (
                            <ProductCard
                                key={p.productId}
                                product={p}
                                isWishlisted={isInWishlist(p.productId)}
                                onToggleWishlist={() => handleToggleWishlist(p)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}