const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const tokenService = require('../services/token.service');
const userModel = require('../models/User.model');

/**
 * Verifies the `Authorization: Bearer <accessToken>` header, loads the
 * user, and attaches it as `req.user`. Throws 401 if missing/invalid/expired.
 * Use on any route that requires a logged-in user (customer or admin).
 */
const authenticate = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
        throw ApiError.unauthorized('Authentication token missing');
    }

    let payload;
    try {
        payload = tokenService.verifyAccessToken(token);
    } catch (err) {
        throw ApiError.unauthorized('Invalid or expired session, please log in again');
    }

    const user = await userModel.findById(payload.sub);
    if (!user) {
        throw ApiError.unauthorized('Account no longer exists');
    }

    // Never leak the hash onto req.user
    delete user.password_hash;
    req.user = user;
    next();
});

module.exports = { authenticate };