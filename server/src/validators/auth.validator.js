const { body } = require('express-validator');

/**
 * express-validator chains for auth routes. Used like:
 *   router.post('/register', registerRules, validate, authController.register)
 */

const registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const loginRules = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
];

const forgotPasswordRules = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email').normalizeEmail(),
];

const resetPasswordRules = [
    body('token').trim().notEmpty().withMessage('Reset token is required'),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const verifyEmailRules = [
    body('token').trim().notEmpty().withMessage('Verification token is required'),
];

module.exports = {
    registerRules,
    loginRules,
    forgotPasswordRules,
    resetPasswordRules,
    verifyEmailRules,
};