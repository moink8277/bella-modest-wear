const { query } = require('express-validator');

/**
 * express-validator chains for product routes. Used like:
 *   router.get('/', getProductsRules, validate, productController.getProducts)
 * All are query-param validators since every product route here is a GET.
 */

const getProductsRules = [
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('minPrice must be a positive number'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('maxPrice must be a positive number'),
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
    query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc'])
        .withMessage('Invalid sort value'),
];

const searchProductsRules = [
    query('q').notEmpty().withMessage('Search query is required').trim(),
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('limit must be between 1 and 20'),
];

module.exports = {
    getProductsRules,
    searchProductsRules,
};