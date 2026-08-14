import api from './api';

/**
 * Places an order from the current server-side cart. The backend always
 * recalculates prices/discounts/shipping/totals from scratch (Part 4) —
 * this payload only carries what the customer chose (address, payment
 * method, coupon code), never any amounts.
 */
export async function createOrder({ addressId, paymentMethod, couponCode, notes }) {
    const { data } = await api.post('/orders', { addressId, paymentMethod, couponCode, notes });
    return data;
}

/** Paginated list of the logged-in customer's past orders, for /account/orders. */
export async function getMyOrders(params = {}) {
    const { data } = await api.get('/orders/my', { params });
    return data;
}

/** Single order detail, including items + status history, for order tracking. */
export async function getOrderById(orderId) {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
}

/** Cancels an order while it's still cancellable (before it ships). */
export async function cancelOrder(orderId, reason) {
    const { data } = await api.post(`/orders/${orderId}/cancel`, { reason });
    return data;
}

/** Public order tracking lookup (order number + email), no login required. */
export async function trackOrder({ orderNumber, email }) {
    const { data } = await api.post('/orders/track', { orderNumber, email });
    return data;
}