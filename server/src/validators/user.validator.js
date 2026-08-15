const { body } = require('express-validator');

/**
 * express-validator chains for user profile routes. Used like:
 *   router.put('/me', updateProfileRules, validate, userController.updateProfile)
 */

const updateProfileRules = [
    body('name').optional().trim()
        .isLength({ min: 2, max: 150 }).withMessage('Name must be 2-150 characters'),
    body('phone').optional({ checkFalsy: true }).trim()
        .isMobilePhone('any').withMessage('Enter a valid phone number'),
    body('avatar').optional({ checkFalsy: true }).trim()
        .isURL().withMessage('Avatar must be a valid URL'),
];

const changePasswordRules = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

module.exports = {
    updateProfileRules,
    changePasswordRules,
};