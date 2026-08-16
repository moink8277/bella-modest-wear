const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const cartModel = require('../models/Cart.model');
const productModel = require('../models/Product.model');

/**
 * Computes per-item line totals + cart subtotal from live product/variant
 * data already joined in getCartWithItems. Never trusts a stored price.
 */
function withTotals(items) {
    // mysql2 returns DECIMAL columns (price, sale_price, price_adjustment)
    // as STRINGS, not numbers. Number(...) here is required — without it,
    // "7499.00" + "0.00" does string concatenation instead of addition
    // (e.g. "7499.000.00"), which then multiplies to NaN and silently
    // renders as ₹0 in the UI via formatPrice's `Number(amount) || 0` fallback.
    const enriched = items.map((item) => {
        const basePrice = Number(item.sale_price ?? item.price);
        const adjustment = Number(item.price_adjustment || 0);
        const unitPrice = basePrice + adjustment;
        return { ...item, unitPrice, lineTotal: unitPrice * item.quantity };
    });
    const subtotal = enriched.reduce((sum, item) => sum + item.lineTotal, 0);
    return { items: enriched, subtotal };
}

// GET /api/cart — current user's cart with live pricing
const getCart = asyncHandler(async (req, res) => {
    const { cart, items } = await cartModel.getCartWithItems(req.user.id);
    res.status(200).json(new ApiResponse(200, { cartId: cart.id, ...withTotals(items) }, 'Cart fetched'));
});

// POST /api/cart/items — add a product (+variant) to the cart, or bump quantity if already present
const addItem = asyncHandler(async (req, res) => {
    const { productId, variantId = null, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
        throw ApiError.badRequest('productId and a positive quantity are required');
    }

    const product = await productModel.findById(productId);
    if (!product) {
        throw ApiError.notFound('Product not found');
    }

    // Stock check: if a variant is specified, check that variant's stock;
    // findBySlug is the only place variants are currently fetched, so we
    // re-derive stock via the product's full variant list.
    if (variantId) {
        const full = await productModel.findBySlug(product.slug);
        const variant = full.variants.find((v) => v.id === variantId);
        if (!variant) {
            throw ApiError.badRequest('Invalid variant for this product');
        }
        if (variant.stock_quantity < quantity) {
            throw ApiError.badRequest(`Only ${variant.stock_quantity} in stock`);
        }
    }

    const cart = await cartModel.getOrCreateCart(req.user.id);
    await cartModel.addItem(cart.id, { productId, variantId, quantity });

    const { items } = await cartModel.getCartWithItems(req.user.id);
    res.status(201).json(new ApiResponse(201, { cartId: cart.id, ...withTotals(items) }, 'Item added to cart'));
});

// PUT /api/cart/items/:itemId — set an exact quantity (stepper), re-validating stock
const updateItemQuantity = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
        throw ApiError.badRequest('A positive quantity is required');
    }

    const cart = await cartModel.getOrCreateCart(req.user.id);
    const existing = await cartModel.findItem(req.params.itemId, cart.id);
    if (!existing) {
        throw ApiError.notFound('Cart item not found');
    }

    if (existing.variant_id) {
        const product = await productModel.findById(existing.product_id);
        const full = await productModel.findBySlug(product.slug);
        const variant = full.variants.find((v) => v.id === existing.variant_id);
        if (variant && variant.stock_quantity < quantity) {
            throw ApiError.badRequest(`Only ${variant.stock_quantity} in stock`);
        }
    }

    await cartModel.updateItemQuantity(req.params.itemId, cart.id, quantity);

    const { items } = await cartModel.getCartWithItems(req.user.id);
    res.status(200).json(new ApiResponse(200, { cartId: cart.id, ...withTotals(items) }, 'Cart item updated'));
});

// DELETE /api/cart/items/:itemId
const removeItem = asyncHandler(async (req, res) => {
    const cart = await cartModel.getOrCreateCart(req.user.id);
    const deleted = await cartModel.removeItem(req.params.itemId, cart.id);
    if (!deleted) {
        throw ApiError.notFound('Cart item not found');
    }

    const { items } = await cartModel.getCartWithItems(req.user.id);
    res.status(200).json(new ApiResponse(200, { cartId: cart.id, ...withTotals(items) }, 'Item removed'));
});

// DELETE /api/cart — empties the whole cart (used after checkout)
const clearCart = asyncHandler(async (req, res) => {
    const cart = await cartModel.getOrCreateCart(req.user.id);
    await cartModel.clearCart(cart.id);
    res.status(200).json(new ApiResponse(200, { cartId: cart.id, items: [], subtotal: 0 }, 'Cart cleared'));
});

module.exports = {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
};