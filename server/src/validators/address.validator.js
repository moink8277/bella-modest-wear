const { body } = require('express-validator');

/**
 * express-validator chains for address routes. Used like:
 *   router.post('/', createAddressRules, validate, addressController.createAddress)
 */

const createAddressRules = [
    body('fullName').trim().notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 150 }).withMessage('Full name must be 2-150 characters'),
    body('phone').trim().notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10, max: 20 }).withMessage('Enter a valid phone number'),
    body('line1').trim().notEmpty().withMessage('Address line 1 is required')
        .isLength({ max: 255 }).withMessage('Address line 1 is too long'),
    body('line2').optional({ checkFalsy: true }).trim()
        .isLength({ max: 255 }).withMessage('Address line 2 is too long'),
    body('city').trim().notEmpty().withMessage('City is required')
        .isLength({ max: 100 }).withMessage('City name is too long'),
    body('state').trim().notEmpty().withMessage('State is required')
        .isLength({ max: 100 }).withMessage('State name is too long'),
    body('postalCode').trim().notEmpty().withMessage('Postal code is required')
        .isLength({ min: 4, max: 20 }).withMessage('Enter a valid postal code'),
    body('country').optional({ checkFalsy: true }).trim()
        .isLength({ max: 100 }).withMessage('Country name is too long'),
    body('isDefault').optional().isBoolean().withMessage('isDefault must be true or false'),
];

/**
 * Update reuses the same field rules but every field is optional — a PUT
 * here is a partial update (only fields the user actually changed are sent).
 */
const updateAddressRules = [
    body('fullName').optional().trim()
        .isLength({ min: 2, max: 150 }).withMessage('Full name must be 2-150 characters'),
    body('phone').optional().trim()
        .isLength({ min: 10, max: 20 }).withMessage('Enter a valid phone number'),
    body('line1').optional().trim()
        .isLength({ min: 1, max: 255 }).withMessage('Address line 1 is too long'),
    body('line2').optional({ checkFalsy: true }).trim()
        .isLength({ max: 255 }).withMessage('Address line 2 is too long'),
    body('city').optional().trim()
        .isLength({ min: 1, max: 100 }).withMessage('City name is too long'),
    body('state').optional().trim()
        .isLength({ min: 1, max: 100 }).withMessage('State name is too long'),
    body('postalCode').optional().trim()
        .isLength({ min: 4, max: 20 }).withMessage('Enter a valid postal code'),
    body('country').optional({ checkFalsy: true }).trim()
        .isLength({ max: 100 }).withMessage('Country name is too long'),
];

module.exports = {
    createAddressRules,
    updateAddressRules,
};