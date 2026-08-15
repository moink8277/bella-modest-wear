import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import SEO from '@/components/common/SEO';
import { useAuth } from '@/hooks/useAuth';
import { useFetch } from '@/hooks/useFetch';
import { formatDate } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import * as orderService from '@/services/orderService';

const STATUS_TONE = {
    PENDING: 'neutral',
    PROCESSING: 'gold',
    SHIPPED: 'gold',
    DELIVERED: 'emerald',
    CANCELLED: 'maroon',
};

export default function Overview() {
    const { user } = useAuth();

    // Most recent orders only — full history lives on /account/orders.
    const fetchRecentOrders = useCallback(
        () => orderService.getMyOrders({ limit: 3 }),
        []
    );
    const { data, isLoading, error, refetch } = useFetch(fetchRecentOrders);
    const orders = data?.data?.orders ?? [];

    return (
        <div className="flex flex-col gap-8">
            <SEO title="Account Overview" path="/account" noIndex />

            <Card padding="lg">
                <p className="text-sm text-muted mb-1">Signed in as</p>
                <h2 className="font-display text-2xl text-espresso">{user?.name}</h2>
                <p className="text-sm text-muted mt-1">{user?.email}</p>
                {!user?.email_verified_at && (
                    <Badge tone="gold" className="mt-3">Email not verified</Badge>
                )}
            </Card>

            <div className="grid sm:grid-cols-3 gap-4">
                <Link to="/account/orders">
                    <Card hoverable className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gold" strokeWidth={1.5} />
                        <span className="text-sm text-ink-soft">Your Orders</span>
                    </Card>
                </Link>
                <Link to="/account/addresses">
                    <Card hoverable className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gold" strokeWidth={1.5} />
                        <span className="text-sm text-ink-soft">Addresses</span>
                    </Card>
                </Link>
                <Link to="/account/security">
                    <Card hoverable className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-gold" strokeWidth={1.5} />
                        <span className="text-sm text-ink-soft">Security</span>
                    </Card>
                </Link>
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-xl text-espresso">Recent Orders</h3>
                    <Link
                        to="/account/orders"
                        className="text-xs uppercase tracking-label text-gold-dark inline-flex items-center gap-1 hover:underline"
                    >
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {isLoading && <Loader label="Loading your orders" />}

                {!isLoading && error && (
                    <ErrorState
                        message="We couldn't load your recent orders right now."
                        onRetry={refetch}
                    />
                )}

                {!isLoading && !error && orders.length === 0 && (
                    <EmptyState
                        icon={Package}
                        title="No orders yet"
                        description="Your recent orders will show up here once you place one."
                        actionLabel="Start Shopping"
                        onAction={() => (window.location.href = '/shop')}
                    />
                )}

                {!isLoading && !error && orders.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {orders.map((order) => (
                            <Card key={order.id} padding="md" className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm text-espresso font-medium">#{order.orderNumber}</p>
                                    <p className="text-xs text-muted mt-1">{formatDate(order.createdAt)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge tone={STATUS_TONE[order.status] || 'neutral'}>{order.status}</Badge>
                                    <span className="text-sm text-espresso">{formatPrice(order.total)}</span>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}