const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules,
    verifyEmailRules,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.me);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, authController.resetPassword);
router.post('/verify-email', verifyEmailRules, validate, authController.verifyEmail);

module.exports = router;