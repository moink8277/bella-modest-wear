const { pool } = require('../config/db');

/**
 * Raw DB access for the `coupons` table. Controllers call these — no SQL
 * anywhere else. All queries use parameterized placeholders (`?`).
 */

/** Finds an active-or-not coupon by its code (case-insensitive match, codes are stored as entered). */
async function findByCode(code) {
    const [rows] = await pool.execute(
        'SELECT * FROM coupons WHERE code = ? LIMIT 1',
        [code]
    );
    return rows[0] || null;
}

async function findById(couponId) {
    const [rows] = await pool.execute(
        'SELECT * FROM coupons WHERE id = ? LIMIT 1',
        [couponId]
    );
    return rows[0] || null;
}

module.exports = {
    findByCode,
    findById,
};