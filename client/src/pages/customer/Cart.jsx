import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import QuantitySelector from '@/components/ui/QuantitySelector';
import PriceDisplay from '@/components/ui/PriceDisplay';
import SEO from '@/components/common/SEO';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

export default function Cart() {
    const { items, subtotal, updateQuantity, removeItem } = useCart();

    return (
        <Container className="py-12 sm:py-16">
            <SEO title="Your Cart" path="/cart" noIndex />

            <h1 className="font-display text-3xl sm:text-4xl text-espresso mb-8">Your Cart</h1>

            {items.length === 0 ? (
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    description="Add pieces you love and they'll show up here, ready for checkout."
                    actionLabel="Start Shopping"
                    onAction={() => (window.location.href = '/shop')}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        {items.map((item) => (
                            <Card key={item.id} padding="sm" className="flex items-center gap-4">
                                <Link
                                    to={`/product/${item.slug}`}
                                    className="shrink-0 h-24 w-20 rounded-[var(--radius-bmw)] overflow-hidden bg-cream"
                                >
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-beige to-cream" />
                                    )}
                                </Link>

                                <div className="flex-1 min-w-0 flex flex-col gap-2">
                                    <Link
                                        to={`/product/${item.slug}`}
                                        className="font-body text-sm text-ink-soft hover:text-gold-dark transition-colors line-clamp-1"
                                    >
                                        {item.name}
                                    </Link>
                                    {item.variantLabel && (
                                        <span className="text-xs text-muted">{item.variantLabel}</span>
                                    )}
                                    <PriceDisplay price={item.price} salePrice={item.salePrice} size="sm" />
                                </div>

                                <div className="flex flex-col items-end gap-3 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        aria-label="Remove from cart"
                                        className="text-muted hover:text-maroon transition-colors"
                                    >
                                        <X className="h-4 w-4" strokeWidth={1.5} />
                                    </button>
                                    <QuantitySelector
                                        size="sm"
                                        value={item.quantity}
                                        onChange={(qty) => updateQuantity(item.id, qty)}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>

                    <Card padding="lg" className="flex flex-col gap-5 lg:sticky lg:top-24">
                        <h2 className="font-display text-xl text-espresso">Order Summary</h2>

                        <div className="flex items-center justify-between text-sm text-ink-soft">
                            <span>Subtotal</span>
                            <span className="text-espresso font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        <p className="text-xs text-muted">
                            Shipping and taxes are calculated at checkout.
                        </p>

                        <Button as={Link} to="/checkout" size="lg" className="w-full">
                            Proceed to Checkout
                        </Button>
                    </Card>
                </div>
            )}
        </Container>
    );
}