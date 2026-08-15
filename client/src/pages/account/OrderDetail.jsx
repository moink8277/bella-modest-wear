import { useCallback, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageX } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Loader from '@/components/ui/Loader';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SEO from '@/components/common/SEO';
import { useFetch } from '@/hooks/useFetch';
import { useToast } from '@/context/ToastContext';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { formatPrice } from '@/utils/formatPrice';
import * as orderService from '@/services/orderService';

const STATUS_TONE = {
    PENDING: 'neutral',
    PROCESSING: 'gold',
    SHIPPED: 'gold',
    DELIVERED: 'emerald',
    CANCELLED: 'maroon',
};

const CANCELLABLE_STATUSES = ['PENDING', 'PROCESSING'];

export default function OrderDetail() {
    const { orderId } = useParams();
    const toast = useToast();
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchOrder = useCallback(() => orderService.getOrderById(orderId), [orderId]);
    const { data, isLoading, error, refetch } = useFetch(fetchOrder);
    const order = data?.data ?? null;

    const handleCancel = async () => {
        setIsCancelling(true);
        try {
            await orderService.cancelOrder(orderId);
            toast.success('Order cancelled');
            setCancelModalOpen(false);
            refetch();
        } catch (err) {
            toast.error(err.message || 'Could not cancel this order');
        } finally {
            setIsCancelling(false);
        }
    };

    if (isLoading) return <Loader label="Loading order" />;

    if (error) {
        return (
            <ErrorState
                message="We couldn't load this order. It may not exist or you may not have access to it."
                onRetry={refetch}
            />
        );
    }

    if (!order) return null;

    return (
        <div className="flex flex-col gap-6">
            <SEO title={`Order #${order.orderNumber}`} path={`/account/orders/${orderId}`} noIndex />

            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h2 className="font-display text-2xl text-espresso">Order #{order.orderNumber}</h2>
                    <p className="text-sm text-muted mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <Badge tone={STATUS_TONE[order.status] || 'neutral'}>{order.status}</Badge>
            </div>

            {/* Status history timeline */}
            {order.statusHistory?.length > 0 && (
                <Card padding="lg">
                    <h3 className="font-display text-lg text-espresso mb-4">Order Timeline</h3>
                    <div className="flex flex-col gap-4">
                        {order.statusHistory.map((entry, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald mt-0.5 shrink-0" strokeWidth={1.5} />
                                <div>
                                    <p className="text-sm text-ink-soft">{entry.status}</p>
                                    <p className="text-xs text-muted">{formatDateTime(entry.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Line items */}
            <Card padding="lg">
                <h3 className="font-display text-lg text-espresso mb-4">Items</h3>
                <div className="flex flex-col gap-4">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-16 w-16 object-cover rounded-[var(--radius-bmw)] border border-border shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-espresso truncate">{item.name}</p>
                                <p className="text-xs text-muted mt-1">
                                    {item.variant ? `${item.variant} · ` : ''}Qty {item.quantity}
                                </p>
                            </div>
                            <span className="text-sm text-espresso">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border mt-6 pt-6 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-ink-soft">
                        <span>Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-emerald">
                            <span>Discount</span>
                            <span>-{formatPrice(order.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-ink-soft">
                        <span>Shipping</span>
                        <span>{formatPrice(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between text-espresso font-medium text-base pt-2 border-t border-border">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                    </div>
                </div>
            </Card>

            {/* Shipping address */}
            {order.shippingAddress && (
                <Card padding="lg">
                    <h3 className="font-display text-lg text-espresso mb-3">Shipping Address</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                        <br />
                        {order.shippingAddress.country}
                    </p>
                </Card>
            )}

            <div className="flex items-center gap-3 flex-wrap">
                <Button as={Link} to="/account/orders" variant="ghost" size="sm">
                    Back to Orders
                </Button>
                {CANCELLABLE_STATUSES.includes(order.status) && (
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setCancelModalOpen(true)}
                        className="inline-flex items-center gap-1.5"
                    >
                        <PackageX className="h-4 w-4" strokeWidth={1.5} />
                        Cancel Order
                    </Button>
                )}
            </div>

            <Modal
                open={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="Cancel this order?"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" size="sm" onClick={() => setCancelModalOpen(false)}>
                            Keep Order
                        </Button>
                        <Button variant="danger" size="sm" loading={isCancelling} onClick={handleCancel}>
                            Yes, Cancel It
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-ink-soft">
                    This can't be undone. Your order #{order.orderNumber} will be cancelled.
                </p>
            </Modal>
        </div>
    );
}