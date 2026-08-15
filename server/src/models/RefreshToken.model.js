const { pool } = require('../config/db');

/**
 * Raw DB access for `refresh_tokens`. We store a hash of the refresh token
 * (never the raw token) so a leaked DB dump alone can't be used to log in.
 * Hashing itself happens in services/token.service.js — this file just
 * persists/looks up/revokes rows.
 */

async function create({ userId, tokenHash, expiresAt }) {
    const [result] = await pool.execute(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
        [userId, tokenHash, expiresAt]
    );
    return findById(result.insertId);
}

async function findById(id) {
    const [rows] = await pool.execute(
        `SELECT * FROM refresh_tokens WHERE id = ? LIMIT 1`,
        [id]
    );
    return rows[0] || null;
}

async function findValidByHash(tokenHash) {
    const [rows] = await pool.execute(
        `SELECT * FROM refresh_tokens
     WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
        [tokenHash]
    );
    return rows[0] || null;
}

async function revokeByHash(tokenHash) {
    await pool.execute(
        `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?`,
        [tokenHash]
    );
}

async function revokeAllForUser(userId) {
    await pool.execute(
        `UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL`,
        [userId]
    );
}

module.exports = {
    create,
    findById,
    findValidByHash,
    revokeByHash,
    revokeAllForUser,
};