const ApiError = require('../utils/ApiError');
const couponModel = require('../models/Coupon.model');
const couponUsageModel = require('../models/CouponUsage.model');

/**
 * Shared coupon validation + discount calculation. Used by BOTH
 * coupon.controller.js (apply/validate, against the current cart) AND
 * order.controller.js (createOrder re-validates the coupon fresh at the
 * moment of order placement, against the cart's live subtotal at that
 * exact moment — never trusts a discount amount computed earlier or
 * supplied by the client, since time can pass between "apply" and
 * "place order" and the cart/coupon state can change in between).
 *
 * Throws ApiError.badRequest with a specific message for every invalid
 * case, so both callers get consistent, user-facing error text for free.
 */
async function validateAndComputeDiscount(code, userId, subtotal) {
    if (!code) {
        throw ApiError.badRequest('Coupon code is required');
    }

    const coupon = await couponModel.findByCode(code.trim());
    if (!coupon) {
        throw ApiError.badRequest('Invalid coupon code');
    }

    if (!coupon.is_active) {
        throw ApiError.badRequest('This coupon is no longer active');
    }

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        throw ApiError.badRequest('This coupon is not active yet');
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        throw ApiError.badRequest('This coupon has expired');
    }

    if (coupon.usage_limit !== null) {
        const totalUses = await couponUsageModel.countByCoupon(coupon.id);
        if (totalUses >= coupon.usage_limit) {
            throw ApiError.badRequest('This coupon has reached its usage limit');
        }
    }

    const userUses = await couponUsageModel.countByCouponAndUser(coupon.id, userId);
    if (userUses >= coupon.per_user_limit) {
        throw ApiError.badRequest('You have already used this coupon the maximum number of times');
    }

    // mysql2 returns DECIMAL columns as strings — always Number()-coerce
    // before arithmetic (same trap documented in cart.controller.js).
    const minOrderAmount = Number(coupon.min_order_amount);
    if (subtotal < minOrderAmount) {
        throw ApiError.badRequest(`This coupon requires a minimum order of ₹${minOrderAmount}`);
    }

    const discountValue = Number(coupon.discount_value);
    let discount;
    if (coupon.discount_type === 'PERCENTAGE') {
        discount = (subtotal * discountValue) / 100;
        if (coupon.max_discount_amount !== null) {
            discount = Math.min(discount, Number(coupon.max_discount_amount));
        }
    } else {
        // FIXED — never let a flat discount exceed the order's own subtotal.
        discount = Math.min(discountValue, subtotal);
    }

    return { coupon, discount };
}

module.exports = {
    validateAndComputeDiscount,
};