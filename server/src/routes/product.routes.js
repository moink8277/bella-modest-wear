const express = require('express');
const productController = require('../controllers/product.controller');
const validate = require('../middleware/validate.middleware');
const { getProductsRules, searchProductsRules } = require('../validators/product.validator');

const router = express.Router();

// All routes here are public — no auth needed to browse products.
// IMPORTANT: /featured and /search must come before /:slug, otherwise
// Express would treat "featured"/"search" as a slug value.
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', searchProductsRules, validate, productController.searchProducts);
router.get('/', getProductsRules, validate, productController.getProducts);
router.get('/:productId/related', productController.getRelatedProducts);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;