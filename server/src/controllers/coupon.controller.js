const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const cartModel = require('../models/Cart.model');
const couponService = require('../services/coupon.service');

/**
 * Re-derives the cart's live subtotal exactly the way cart.controller.js
 * does (never trusts a cached/stored amount) — coupon math must always be
 * computed against the CURRENT cart, not whatever it was a minute ago.
 */
async function getCartSubtotal(userId) {
    const { items } = await cartModel.getCartWithItems(userId);
    const subtotal = items.reduce((sum, item) => {
        const basePrice = Number(item.sale_price ?? item.price);
        const adjustment = Number(item.price_adjustment || 0);
        return sum + (basePrice + adjustment) * item.quantity;
    }, 0);
    return subtotal;
}

// POST /api/coupons/apply — validates a code against the CURRENT cart's live
// subtotal and returns the discount. Does not persist anything server-side
// (carts have no coupon_id column by design) — the frontend holds onto the
// applied code and sends it again with order placement, where it's
// re-validated fresh (see order.controller.js's createOrder).
const applyCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const subtotal = await getCartSubtotal(req.user.id);

    const { coupon, discount } = await couponService.validateAndComputeDiscount(code, req.user.id, subtotal);

    res.status(200).json(
        new ApiResponse(200, {
            code: coupon.code,
            discountType: coupon.discount_type,
            discount,
            subtotal,
            total: subtotal - discount,
        }, 'Coupon applied')
    );
});

// DELETE /api/coupons/apply — no server-side state to clear (nothing is
// persisted when a coupon is "applied", see above), this exists purely so
// the frontend has a symmetrical endpoint to call when the user removes
// their applied coupon in the UI.
const removeCoupon = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, null, 'Coupon removed'));
});

// GET /api/coupons/validate/:code — lightweight precheck (e.g. to show a
// "valid code" hint as the user types, before they commit to applying it).
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const subtotal = await getCartSubtotal(req.user.id);

    const { coupon, discount } = await couponService.validateAndComputeDiscount(code, req.user.id, subtotal);

    res.status(200).json(
        new ApiResponse(200, {
            code: coupon.code,
            discountType: coupon.discount_type,
            discount,
        }, 'Coupon is valid')
    );
});

module.exports = {
    applyCoupon,
    removeCoupon,
    validateCoupon,
};