const { pool } = require('../config/db');

/**
 * Raw DB access for the `coupon_usages` table — tracks how many times a
 * coupon has been used overall and per-user, to enforce usage_limit and
 * per_user_limit. Controllers call these — no SQL anywhere else.
 */

/** Total number of times this coupon has ever been used, across all users. */
async function countByCoupon(couponId) {
    const [rows] = await pool.execute(
        'SELECT COUNT(*) AS count FROM coupon_usages WHERE coupon_id = ?',
        [couponId]
    );
    return rows[0].count;
}

/** Number of times this specific user has used this specific coupon. */
async function countByCouponAndUser(couponId, userId) {
    const [rows] = await pool.execute(
        'SELECT COUNT(*) AS count FROM coupon_usages WHERE coupon_id = ? AND user_id = ?',
        [couponId, userId]
    );
    return rows[0].count;
}

/**
 * Records a usage. Accepts an optional `connection` (a checked-out
 * transaction connection from pool.getConnection()) so this can
 * participate in the same atomic transaction as order creation — a
 * coupon usage must never be recorded unless the order it belongs to
 * was actually created. Falls back to the plain pool for standalone
 * calls (e.g. if a usage ever needs recording outside an order flow).
 */
async function create({ couponId, userId, orderId = null }, connection = pool) {
    const [result] = await connection.execute(
        'INSERT INTO coupon_usages (coupon_id, user_id, order_id) VALUES (?, ?, ?)',
        [couponId, userId, orderId]
    );
    return result.insertId;
}

module.exports = {
    countByCoupon,
    countByCouponAndUser,
    create,
};