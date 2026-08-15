const express = require('express');
const categoryController = require('../controllers/category.controller');

const router = express.Router();

// All routes here are public — no auth needed to browse categories.
router.get('/', categoryController.getCategories);
router.get('/:categorySlug/subcategories', categoryController.getSubcategories);
router.get('/:slug', categoryController.getCategoryBySlug);

module.exports = router;