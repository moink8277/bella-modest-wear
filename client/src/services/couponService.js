import api from './api';

/**
 * Validates + applies a coupon code against the current cart. Server-
 * calculated only (Part 3/4) — this returns the discount amount computed
 * by the backend; the frontend never calculates or guesses the discount
 * itself, it just displays whatever the server returns.
 */
export async function applyCoupon(code) {
    const { data } = await api.post('/coupons/apply', { code });
    return data;
}

export async function removeCoupon() {
    const { data } = await api.delete('/coupons/apply');
    return data;
}

/** Lightweight check (e.g. for showing "valid code" hint before full apply). */
export async function validateCoupon(code) {
    const { data } = await api.get(`/coupons/validate/${code}`);
    return data;
}