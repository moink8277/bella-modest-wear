const express = require('express');
const couponController = require('../controllers/coupon.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { applyCouponRules, validateCouponParamRules } = require('../validators/coupon.validator');

const router = express.Router();

// Every coupon route requires a logged-in user — coupons are validated
// against the logged-in user's cart and per-user usage limits.
router.use(authenticate);

router.post('/apply', applyCouponRules, validate, couponController.applyCoupon);
router.delete('/apply', couponController.removeCoupon);
router.get('/validate/:code', validateCouponParamRules, validate, couponController.validateCoupon);

module.exports = router;