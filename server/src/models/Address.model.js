const { pool } = require('../config/db');

/**
 * Raw DB access for the `addresses` table (customer's saved address book,
 * used in /account/addresses and at checkout). Controllers call these —
 * no SQL anywhere else. All queries use parameterized placeholders (`?`).
 */

/** All of a user's saved addresses, most-recently-created first, default pinned to top. */
async function findAllByUser(userId) {
    const [rows] = await pool.execute(
        `SELECT * FROM addresses
         WHERE user_id = ?
         ORDER BY is_default DESC, created_at DESC`,
        [userId]
    );
    return rows;
}

/** Single address, scoped to userId so a user can't read another user's address. */
async function findById(addressId, userId) {
    const [rows] = await pool.execute(
        'SELECT * FROM addresses WHERE id = ? AND user_id = ? LIMIT 1',
        [addressId, userId]
    );
    return rows[0] || null;
}

/**
 * Creates a new address. If this is the user's first address ever, it's
 * forced to be default regardless of what was passed in — a user should
 * never end up with zero default addresses.
 */
async function create(userId, { fullName, phone, line1, line2 = null, city, state, postalCode, country = 'India', isDefault = false }) {
    const existingCount = await countByUser(userId);
    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
        await clearDefault(userId);
    }

    const [result] = await pool.execute(
        `INSERT INTO addresses
            (user_id, full_name, phone, line1, line2, city, state, postal_code, country, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, fullName, phone, line1, line2, city, state, postalCode, country, shouldBeDefault]
    );
    return findById(result.insertId, userId);
}

/** Partial update — only fields explicitly passed are changed. */
async function update(addressId, userId, fields) {
    const columnMap = {
        fullName: 'full_name',
        phone: 'phone',
        line1: 'line1',
        line2: 'line2',
        city: 'city',
        state: 'state',
        postalCode: 'postal_code',
        country: 'country',
    };

    const sets = [];
    const values = [];
    for (const [key, column] of Object.entries(columnMap)) {
        if (fields[key] !== undefined) {
            sets.push(`${column} = ?`);
            values.push(fields[key]);
        }
    }

    if (sets.length === 0) return findById(addressId, userId);

    values.push(addressId, userId);
    await pool.execute(
        `UPDATE addresses SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
        values
    );
    return findById(addressId, userId);
}

/**
 * Deletes an address. If the deleted one was the default and other
 * addresses remain, promotes the most recently created remaining one
 * to default — again, never leave a user with zero default addresses.
 */
async function deleteById(addressId, userId) {
    const address = await findById(addressId, userId);
    if (!address) return false;

    const [result] = await pool.execute(
        'DELETE FROM addresses WHERE id = ? AND user_id = ?',
        [addressId, userId]
    );

    if (result.affectedRows > 0 && address.is_default) {
        const [remaining] = await pool.execute(
            'SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        if (remaining[0]) {
            await pool.execute('UPDATE addresses SET is_default = TRUE WHERE id = ?', [remaining[0].id]);
        }
    }

    return result.affectedRows > 0;
}

/** Unsets is_default on every address for this user — used before setting a new one. */
async function clearDefault(userId) {
    await pool.execute('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
}

/** Sets one address as the default (and clears any previous default first). */
async function setDefault(addressId, userId) {
    const address = await findById(addressId, userId);
    if (!address) return null;

    await clearDefault(userId);
    await pool.execute('UPDATE addresses SET is_default = TRUE WHERE id = ? AND user_id = ?', [addressId, userId]);
    return findById(addressId, userId);
}

async function countByUser(userId) {
    const [rows] = await pool.execute('SELECT COUNT(*) AS count FROM addresses WHERE user_id = ?', [userId]);
    return rows[0].count;
}

module.exports = {
    findAllByUser,
    findById,
    create,
    update,
    deleteById,
    clearDefault,
    setDefault,
    countByUser,
};