const { pool } = require('../config/db');

/**
 * Raw DB access for `carts` and `cart_items`. Controllers call these —
 * no SQL anywhere else. All queries use parameterized placeholders (`?`).
 *
 * Design: cart_items stores ONLY product_id + variant_id + quantity.
 * Price/stock are never cached here — always joined live from
 * products/product_variants so the cart total is never stale
 * (golden rule: backend is source of truth for prices).
 */

/** Returns the user's cart row, creating one if it doesn't exist yet. */
async function getOrCreateCart(userId) {
    const [existing] = await pool.execute(
        'SELECT * FROM carts WHERE user_id = ? LIMIT 1',
        [userId]
    );
    if (existing[0]) return existing[0];

    const [result] = await pool.execute(
        'INSERT INTO carts (user_id) VALUES (?)',
        [userId]
    );
    return { id: result.insertId, user_id: userId };
}

/**
 * Full cart contents for a user: each item joined with live product
 * (name, slug, image, price, sale_price) and variant (size, color,
 * stock_quantity, price_adjustment) details.
 */
async function getCartWithItems(userId) {
    const cart = await getOrCreateCart(userId);

    const [items] = await pool.execute(
        `SELECT
            ci.id,
            ci.product_id,
            ci.variant_id,
            ci.quantity,
            p.name,
            p.slug,
            p.price,
            p.sale_price,
            pv.size,
            pv.color,
            pv.color_hex,
            pv.stock_quantity,
            pv.price_adjustment,
            (SELECT url FROM product_images
             WHERE product_id = p.id
             ORDER BY is_primary DESC, display_order ASC LIMIT 1) AS image
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        LEFT JOIN product_variants pv ON pv.id = ci.variant_id
        WHERE ci.cart_id = ?
        ORDER BY ci.created_at DESC`,
        [cart.id]
    );

    return { cart, items };
}

/**
 * Adds an item, or increments quantity if the same product+variant
 * combo is already in the cart (relies on the unique_cart_product_variant
 * constraint — ON DUPLICATE KEY UPDATE keeps this atomic).
 */
async function addItem(cartId, { productId, variantId = null, quantity = 1 }) {
    await pool.execute(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
        [cartId, productId, variantId, quantity]
    );
}

/** Sets an item's quantity to an exact value (used by the quantity stepper). */
async function updateItemQuantity(cartItemId, cartId, quantity) {
    const [result] = await pool.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?',
        [quantity, cartItemId, cartId]
    );
    return result.affectedRows > 0;
}

/** Removes a single item. Scoped to cartId so a user can't delete another user's item. */
async function removeItem(cartItemId, cartId) {
    const [result] = await pool.execute(
        'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
        [cartItemId, cartId]
    );
    return result.affectedRows > 0;
}

/** Empties the whole cart (used after successful checkout, or an explicit "clear cart"). */
async function clearCart(cartId) {
    await pool.execute('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
}

/** Finds a single cart_item row, scoped to cartId — used to check ownership + stock before update. */
async function findItem(cartItemId, cartId) {
    const [rows] = await pool.execute(
        'SELECT * FROM cart_items WHERE id = ? AND cart_id = ? LIMIT 1',
        [cartItemId, cartId]
    );
    return rows[0] || null;
}

module.exports = {
    getOrCreateCart,
    getCartWithItems,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    findItem,
};