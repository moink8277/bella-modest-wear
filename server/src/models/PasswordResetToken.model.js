const { pool } = require('../config/db');

/**
 * Raw DB access for `password_reset_tokens`. Same hash-only pattern as
 * refresh tokens — the raw token is only ever in the email link, never in the DB.
 */

async function create({ userId, tokenHash, expiresAt }) {
    await pool.execute(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
        [userId, tokenHash, expiresAt]
    );
}

async function findValidByHash(tokenHash) {
    const [rows] = await pool.execute(
        `SELECT * FROM password_reset_tokens
     WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
        [tokenHash]
    );
    return rows[0] || null;
}

async function markUsed(id) {
    await pool.execute(
        `UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?`,
        [id]
    );
}

module.exports = { create, findValidByHash, markUsed };