const { pool } = require('../config/db');

/**
 * Raw DB access for the `users` table. Controllers/services call these —
 * no SQL anywhere else. All queries use parameterized placeholders (`?`),
 * never string concatenation.
 */

async function create({ name, email, passwordHash, role = 'CUSTOMER' }) {
    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        [name, email, passwordHash, role]
    );
    return findById(result.insertId);
}

async function findByEmail(email) {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE email = ? LIMIT 1`,
        [email]
    );
    return rows[0] || null;
}

async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT * FROM users WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

async function updateProfile(id, { name, phone, avatar }) {
    const fields = [];
    const values = [];

    if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
    }
    if (phone !== undefined) {
        fields.push('phone = ?');
        values.push(phone);
    }
    if (avatar !== undefined) {
        fields.push('avatar = ?');
        values.push(avatar);
    }

    if (fields.length === 0) return findById(id);

    values.push(id);
    await pool.execute(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
    );
    return findById(id);
}

async function updatePassword(id, passwordHash) {
    await pool.execute(
        `UPDATE users SET password_hash = ? WHERE id = ?`,
        [passwordHash, id]
    );
}

async function markEmailVerified(id) {
    await pool.execute(
        `UPDATE users SET email_verified_at = NOW() WHERE id = ?`,
        [id]
    );
}

async function deleteById(id) {
    await pool.execute(`DELETE FROM users WHERE id = ?`, [id]);
}

module.exports = {
    create,
    findByEmail,
    findById,
    updateProfile,
    updatePassword,
    markEmailVerified,
    deleteById,
};