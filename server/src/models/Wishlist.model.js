const { pool } = require('../config/db');

/**
 * Raw DB access for `wishlists` and `wishlist_items`. Controllers call
 * these — no SQL anywhere else. All queries use parameterized placeholders.
 *
 * Unlike cart_items, wishlist_items has NO variant_id and NO quantity —
 * a product is either wishlisted or not (one row per product, enforced by
 * the unique_wishlist_product constraint).
 */

/** Returns the user's wishlist row, creating one if it doesn't exist yet. */
async function getOrCreateWishlist(userId) {
    const [existing] = await pool.execute(
        'SELECT * FROM wishlists WHERE user_id = ? LIMIT 1',
        [userId]
    );
    if (existing[0]) return existing[0];

    const [result] = await pool.execute(
        'INSERT INTO wishlists (user_id) VALUES (?)',
        [userId]
    );
    return { id: result.insertId, user_id: userId };
}

/**
 * Full wishlist contents for a user: each item joined with live product
 * data (name, slug, price, sale_price, is_new, is_bestseller,
 * stock_quantity) and its primary image. No price math needed here (no
 * variants), but fields are still pulled live so a stale name/price
 * never shows.
 */
async function getWishlistWithItems(userId) {
    const wishlist = await getOrCreateWishlist(userId);

    const [items] = await pool.execute(
        `SELECT
            wi.id,
            wi.product_id,
            wi.created_at AS added_at,
            p.name,
            p.slug,
            p.price,
            p.sale_price,
            p.is_new,
            p.is_bestseller,
            p.stock_quantity,
            (SELECT url FROM product_images
             WHERE product_id = p.id
             ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS image
        FROM wishlist_items wi
        JOIN products p ON p.id = wi.product_id
        WHERE wi.wishlist_id = ?
        ORDER BY wi.created_at DESC`,
        [wishlist.id]
    );

    return { wishlist, items };
}

/**
 * Adds a product to the wishlist. INSERT IGNORE is a no-op if the product
 * is already wishlisted (relies on the unique_wishlist_product constraint) —
 * unlike cart, there's no quantity to bump.
 */
async function addItem(wishlistId, productId) {
    await pool.execute(
        'INSERT IGNORE INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)',
        [wishlistId, productId]
    );
}

/** Removes a product from the wishlist. Scoped to wishlistId so a user can't remove another user's item. */
async function removeItem(productId, wishlistId) {
    const [result] = await pool.execute(
        'DELETE FROM wishlist_items WHERE product_id = ? AND wishlist_id = ?',
        [productId, wishlistId]
    );
    return result.affectedRows > 0;
}

/**
 * Bulk-merges a guest's locally-stored wishlist (array of product IDs)
 * into the user's server-side wishlist on login. INSERT IGNORE handles
 * both cases in one query: products already wishlisted are silently
 * skipped (unique constraint), and any stale/deleted product IDs from an
 * old localStorage list are silently skipped too (FK constraint) — no
 * need to pre-validate the incoming ID list.
 */
async function mergeItems(wishlistId, productIds) {
    if (!productIds || productIds.length === 0) return;

    const values = productIds.map((productId) => [wishlistId, productId]);
    await pool.query(
        'INSERT IGNORE INTO wishlist_items (wishlist_id, product_id) VALUES ?',
        [values]
    );
}

/** Checks whether a specific product is already wishlisted — used to avoid a redundant INSERT round-trip if needed later. */
async function findItem(productId, wishlistId) {
    const [rows] = await pool.execute(
        'SELECT * FROM wishlist_items WHERE product_id = ? AND wishlist_id = ? LIMIT 1',
        [productId, wishlistId]
    );
    return rows[0] || null;
}

module.exports = {
    getOrCreateWishlist,
    getWishlistWithItems,
    addItem,
    removeItem,
    mergeItems,
    findItem,
};