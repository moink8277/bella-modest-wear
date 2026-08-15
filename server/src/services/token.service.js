const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

/**
 * JWT + refresh-token helpers used by auth.controller.js.
 *
 * Access token: short-lived JWT, sent in the response body, kept by the
 * client (localStorage — see AuthContext.jsx) and attached as
 * `Authorization: Bearer <token>` on requests.
 *
 * Refresh token: long-lived opaque random string, sent as an HttpOnly
 * cookie (never readable by JS). We store only a SHA-256 hash of it in
 * `refresh_tokens` (see RefreshToken.model.js) — the raw value never
 * touches the database.
 */

function signAccessToken(user) {
    return jwt.sign(
        { sub: user.id, role: user.role },
        env.jwt.accessSecret,
        { expiresIn: env.jwt.accessExpiry }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(token, env.jwt.accessSecret);
}

function generateRefreshToken() {
    return crypto.randomBytes(48).toString('hex');
}

function hashRefreshToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/** Turns env.jwt.refreshExpiry (e.g. "7d", "15m") into a JS Date for the DB row. */
function refreshTokenExpiryDate() {
    const match = /^(\d+)([smhd])$/.exec(env.jwt.refreshExpiry);
    const amount = match ? Number(match[1]) : 7;
    const unit = match ? match[2] : 'd';

    const msPerUnit = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
    return new Date(Date.now() + amount * (msPerUnit[unit] || msPerUnit.d));
}

/** Random hex token for one-off links (password reset, email verify) — same hashing approach. */
function generateOneTimeToken() {
    return crypto.randomBytes(32).toString('hex');
}

function hashOneTimeToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    hashRefreshToken,
    refreshTokenExpiryDate,
    generateOneTimeToken,
    hashOneTimeToken,
};