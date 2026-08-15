const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const userModel = require('../models/User.model');
const refreshTokenModel = require('../models/RefreshToken.model');
const passwordResetModel = require('../models/PasswordResetToken.model');
const emailVerificationModel = require('../models/EmailVerificationToken.model');
const tokenService = require('../services/token.service');

const REFRESH_COOKIE_NAME = 'bmw_refresh_token';
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/api/auth',
};

function stripPassword(user) {
    const { password_hash, ...safe } = user;
    return safe;
}

/** Issues a new access token + refresh token pair, persists the refresh
 *  token's hash, and sets it as an HttpOnly cookie on the response. */
async function issueSession(user, res) {
    const accessToken = tokenService.signAccessToken(user);

    const rawRefreshToken = tokenService.generateRefreshToken();
    const tokenHash = tokenService.hashRefreshToken(rawRefreshToken);
    const expiresAt = tokenService.refreshTokenExpiryDate();

    await refreshTokenModel.create({ userId: user.id, tokenHash, expiresAt });

    res.cookie(REFRESH_COOKIE_NAME, rawRefreshToken, {
        ...REFRESH_COOKIE_OPTIONS,
        expires: expiresAt,
    });

    return accessToken;
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
        throw ApiError.conflict('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userModel.create({ name, email, passwordHash });

    const accessToken = await issueSession(user, res);

    res.status(201).json(
        new ApiResponse(201, { accessToken, user: stripPassword(user) }, 'Account created successfully')
    );
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = await issueSession(user, res);

    res.status(200).json(
        new ApiResponse(200, { accessToken, user: stripPassword(user) }, 'Logged in successfully')
    );
});

// POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (rawRefreshToken) {
        const tokenHash = tokenService.hashRefreshToken(rawRefreshToken);
        await refreshTokenModel.revokeByHash(tokenHash);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_OPTIONS);
    res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

// POST /api/auth/refresh
const refresh = asyncHandler(async (req, res) => {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!rawRefreshToken) {
        throw ApiError.unauthorized('No refresh token, please log in again');
    }

    const tokenHash = tokenService.hashRefreshToken(rawRefreshToken);
    const stored = await refreshTokenModel.findValidByHash(tokenHash);
    if (!stored) {
        throw ApiError.unauthorized('Session expired, please log in again');
    }

    const user = await userModel.findById(stored.user_id);
    if (!user) {
        throw ApiError.unauthorized('Account no longer exists');
    }

    // Rotate: revoke the old refresh token, issue a brand new pair.
    await refreshTokenModel.revokeByHash(tokenHash);
    const accessToken = await issueSession(user, res);

    res.status(200).json(
        new ApiResponse(200, { accessToken, user: stripPassword(user) }, 'Session refreshed')
    );
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
    // req.user is already set by the `authenticate` middleware.
    res.status(200).json(new ApiResponse(200, stripPassword(req.user), 'Current user'));
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await userModel.findByEmail(email);
    // Always respond the same way whether or not the account exists —
    // don't leak which emails are registered.
    if (user) {
        const rawToken = tokenService.generateOneTimeToken();
        const tokenHash = tokenService.hashOneTimeToken(rawToken);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await passwordResetModel.create({ userId: user.id, tokenHash, expiresAt });

        // Email sending arrives with the SMTP integration (Phase 4/10).
        // For now, log it so it's usable locally during development.
        console.log(`[password reset] token for ${email}: ${rawToken}`);
    }

    res.status(200).json(
        new ApiResponse(200, null, 'If an account exists for this email, a reset link has been sent')
    );
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const tokenHash = tokenService.hashOneTimeToken(token);
    const stored = await passwordResetModel.findValidByHash(tokenHash);
    if (!stored) {
        throw ApiError.badRequest('This reset link is invalid or has expired');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await userModel.updatePassword(stored.user_id, passwordHash);
    await passwordResetModel.markUsed(stored.id);
    await refreshTokenModel.revokeAllForUser(stored.user_id); // log out everywhere

    res.status(200).json(new ApiResponse(200, null, 'Password reset successfully, please log in'));
});

// POST /api/auth/verify-email
const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const tokenHash = tokenService.hashOneTimeToken(token);
    const stored = await emailVerificationModel.findValidByHash(tokenHash);
    if (!stored) {
        throw ApiError.badRequest('This verification link is invalid or has expired');
    }

    await userModel.markEmailVerified(stored.user_id);
    await emailVerificationModel.markUsed(stored.id);

    res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'));
});

module.exports = {
    register,
    login,
    logout,
    refresh,
    me,
    forgotPassword,
    resetPassword,
    verifyEmail,
};