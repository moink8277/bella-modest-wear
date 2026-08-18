const { body, param } = require('express-validator');

/**
 * express-validator chains for coupon routes. Used like:
 *   router.post('/apply', applyCouponRules, validate, couponController.applyCoupon)
 */

const applyCouponRules = [
    body('code').trim().notEmpty().withMessage('Coupon code is required')
        .isLength({ max: 50 }).withMessage('Coupon code is too long'),
];

const validateCouponParamRules = [
    param('code').trim().notEmpty().withMessage('Coupon code is required'),
];

module.exports = {
    applyCouponRules,
    validateCouponParamRules,
};