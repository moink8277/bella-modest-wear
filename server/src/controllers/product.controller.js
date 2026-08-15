const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const productModel = require('../models/Product.model');

// GET /api/products — paginated, filtered list for /shop
const getProducts = asyncHandler(async (req, res) => {
    const filters = {
        category: req.query.category,
        subcategory: req.query.subcategory,
        size: req.query.size,
        color: req.query.color,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        tag: req.query.tag,
        sort: req.query.sort,
        search: req.query.search,
        page: req.query.page,
        limit: req.query.limit,
    };

    const [{ products, page, limit }, total] = await Promise.all([
        productModel.findAll(filters),
        productModel.count(filters),
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            products,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        }, 'Products fetched')
    );
});

// GET /api/products/featured?type=&limit= — homepage collections
// NOTE: registered before /:slug in routes so "featured" isn't read as a slug.
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const { type = 'featured', limit } = req.query;
    const products = await productModel.findFeatured(type, limit ? parseInt(limit, 10) : 8);
    res.status(200).json(new ApiResponse(200, products, 'Featured products fetched'));
});

// GET /api/products/search?q=&limit= — search bar autocomplete
// NOTE: also registered before /:slug for the same reason.
const searchProducts = asyncHandler(async (req, res) => {
    const { q, limit } = req.query;
    if (!q || !q.trim()) {
        return res.status(200).json(new ApiResponse(200, [], 'No query provided'));
    }
    const products = await productModel.search(q.trim(), limit ? parseInt(limit, 10) : 6);
    res.status(200).json(new ApiResponse(200, products, 'Search results fetched'));
});

// GET /api/products/:slug — full detail page
const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await productModel.findBySlug(req.params.slug);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }
    res.status(200).json(new ApiResponse(200, product, 'Product fetched'));
});

// GET /api/products/:productId/related?limit= — related products for the detail page
const getRelatedProducts = asyncHandler(async (req, res) => {
    const { limit } = req.query;
    const products = await productModel.findRelated(
        req.params.productId,
        limit ? parseInt(limit, 10) : 8
    );
    res.status(200).json(new ApiResponse(200, products, 'Related products fetched'));
});

module.exports = {
    getProducts,
    getFeaturedProducts,
    searchProducts,
    getProductBySlug,
    getRelatedProducts,
};