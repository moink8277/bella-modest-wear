const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const wishlistModel = require('../models/Wishlist.model');
const productModel = require('../models/Product.model');

// GET /api/wishlist — current user's wishlist with live product data
const getWishlist = asyncHandler(async (req, res) => {
    const { wishlist, items } = await wishlistModel.getWishlistWithItems(req.user.id);
    res.status(200).json(new ApiResponse(200, { wishlistId: wishlist.id, items }, 'Wishlist fetched'));
});

// POST /api/wishlist/items — add a product to the wishlist (no-op if already present)
const addItem = asyncHandler(async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
        throw ApiError.badRequest('productId is required');
    }

    const product = await productModel.findById(productId);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    const wishlist = await wishlistModel.getOrCreateWishlist(req.user.id);
    await wishlistModel.addItem(wishlist.id, productId);

    const { items } = await wishlistModel.getWishlistWithItems(req.user.id);
    res.status(201).json(new ApiResponse(201, { wishlistId: wishlist.id, items }, 'Item added to wishlist'));
});

// DELETE /api/wishlist/items/:productId — note: keyed by productId directly, not a wishlist_item row id
const removeItem = asyncHandler(async (req, res) => {
    const wishlist = await wishlistModel.getOrCreateWishlist(req.user.id);
    const deleted = await wishlistModel.removeItem(req.params.productId, wishlist.id);
    if (!deleted) {
        throw ApiError.notFound('Item not found in wishlist');
    }

    const { items } = await wishlistModel.getWishlistWithItems(req.user.id);
    res.status(200).json(new ApiResponse(200, { wishlistId: wishlist.id, items }, 'Item removed from wishlist'));
});

// POST /api/wishlist/merge — bulk-merges a guest's localStorage wishlist into the account on login.
// No prior art in this codebase (cart has no guest state to merge, since cart requires login).
// Invalid/duplicate/already-wishlisted productIds are silently skipped by the model's INSERT IGNORE —
// no need to pre-validate the incoming array here.
const mergeWishlist = asyncHandler(async (req, res) => {
    const { productIds } = req.body;

    if (!Array.isArray(productIds)) {
        throw ApiError.badRequest('productIds must be an array');
    }

    const wishlist = await wishlistModel.getOrCreateWishlist(req.user.id);
    await wishlistModel.mergeItems(wishlist.id, productIds);

    const { items } = await wishlistModel.getWishlistWithItems(req.user.id);
    res.status(200).json(new ApiResponse(200, { wishlistId: wishlist.id, items }, 'Wishlist merged'));
});

module.exports = {
    getWishlist,
    addItem,
    removeItem,
    mergeWishlist,
};