import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import SEO from '@/components/common/SEO';
import { useFetch } from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
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

const LIMIT = 10;

export default function Orders() {
    const [page, setPage] = useState(1);

    const fetchOrders = useCallback(
        () => orderService.getMyOrders({ page, limit: LIMIT }),
        [page]
    );
    const { data, isLoading, error, refetch } = useFetch(fetchOrders);

    const orders = data?.data?.orders ?? [];
    const totalItems = data?.data?.total ?? 0;

    const { totalPages } = usePagination({ totalItems, initialLimit: LIMIT });

    return (
        <div className="flex flex-col gap-6">
            <SEO title="Your Orders" path="/account/orders" noIndex />

            <h2 className="font-display text-2xl text-espresso">Your Orders</h2>

            {isLoading && <Loader label="Loading your orders" />}

            {!isLoading && error && (
                <ErrorState
                    message="We couldn't load your orders right now."
                    onRetry={refetch}
                />
            )}

            {!isLoading && !error && orders.length === 0 && (
                <EmptyState
                    icon={Package}
                    title="No orders yet"
                    description="Once you place an order, you'll be able to track it here."
                    actionLabel="Start Shopping"
                    onAction={() => (window.location.href = '/shop')}
                />
            )}

            {!isLoading && !error && orders.length > 0 && (
                <>
                    <div className="flex flex-col gap-3">
                        {orders.map((order) => (
                            <Link key={order.id} to={`/account/orders/${order.id}`}>
                                <Card hoverable padding="md" className="flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-sm text-espresso font-medium">#{order.orderNumber}</p>
                                        <p className="text-xs text-muted mt-1">{formatDate(order.createdAt)}</p>
                                        <p className="text-xs text-muted mt-1">
                                            {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge tone={STATUS_TONE[order.status] || 'neutral'}>{order.status}</Badge>
                                        <span className="text-sm text-espresso">{formatPrice(order.total)}</span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-2" />
                </>
            )}
        </div>
    );
}