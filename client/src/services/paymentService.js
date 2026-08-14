import api from './api';

/**
 * Payment architecture (Part 6): Razorpay is the primary gateway, with
 * Stripe + PayPal as alternates, plus Cash on Delivery. The flow for all
 * gateway-based methods is the same shape:
 *   1. createPaymentOrder() — backend creates an order with the gateway
 *      and returns whatever the gateway's checkout widget needs (e.g.
 *      Razorpay order id + key, or a Stripe/PayPal client secret).
 *   2. The gateway's own JS SDK collects payment details (never our code).
 *   3. verifyPayment() — backend verifies the signature/webhook payload
 *      server-side before marking the order as paid. Never trust a
 *      client-reported "payment succeeded" on its own.
 */

/** Creates a gateway payment order for a given order + provider. */
export async function createPaymentOrder(orderId, provider = 'razorpay') {
    const { data } = await api.post(`/payments/${provider}/order`, { orderId });
    return data;
}

/** Verifies payment after the gateway widget completes (signature/reference check). */
export async function verifyPayment(provider, payload) {
    const { data } = await api.post(`/payments/${provider}/verify`, payload);
    return data;
}

/** Places a Cash on Delivery order — no gateway involved, just confirms COD selection. */
export async function confirmCodOrder(orderId) {
    const { data } = await api.post('/payments/cod/confirm', { orderId });
    return data;
}

/** Payment status for an order, used for polling/refresh on the confirmation page. */
export async function getPaymentStatus(orderId) {
    const { data } = await api.get(`/payments/status/${orderId}`);
    return data;
}