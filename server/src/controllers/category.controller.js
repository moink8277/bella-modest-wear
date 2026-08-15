const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const categoryModel = require('../models/Category.model');

// GET /api/categories — full nested tree (top-level categories + subcategories)
const getCategories = asyncHandler(async (req, res) => {
    const tree = await categoryModel.findTree();
    res.status(200).json(new ApiResponse(200, tree, 'Categories fetched'));
});

// GET /api/categories/:slug — single category with its subcategories
const getCategoryBySlug = asyncHandler(async (req, res) => {
    const category = await categoryModel.findBySlug(req.params.slug);
    if (!category) {
        throw ApiError.notFound('Category not found');
    }

    const subcategories = await categoryModel.findSubcategories(category.id);
    res.status(200).json(
        new ApiResponse(200, { ...category, subcategories }, 'Category fetched')
    );
});

// GET /api/categories/:categorySlug/subcategories — used for /shop filter dropdowns
const getSubcategories = asyncHandler(async (req, res) => {
    const category = await categoryModel.findBySlug(req.params.categorySlug);
    if (!category) {
        throw ApiError.notFound('Category not found');
    }

    const subcategories = await categoryModel.findSubcategories(category.id);
    res.status(200).json(new ApiResponse(200, subcategories, 'Subcategories fetched'));
});

module.exports = {
    getCategories,
    getCategoryBySlug,
    getSubcategories,
};