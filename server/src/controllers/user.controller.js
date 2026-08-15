const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const userModel = require('../models/User.model');
const refreshTokenModel = require('../models/RefreshToken.model');

function stripPassword(user) {
    const { password_hash, ...safe } = user;
    return safe;
}

// GET /api/users/me
const getProfile = asyncHandler(async (req, res) => {
    // req.user is set by the `authenticate` middleware, but re-fetch fresh
    // from the DB rather than trusting the token payload — profile fields
    // (name/phone/avatar) can change between token issuance and this call.
    const user = await userModel.findById(req.user.id);
    if (!user) {
        throw ApiError.notFound('Account no longer exists');
    }

    res.status(200).json(new ApiResponse(200, stripPassword(user), 'Profile fetched'));
});

// PUT /api/users/me
const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, avatar } = req.body;

    const updated = await userModel.updateProfile(req.user.id, { name, phone, avatar });
    if (!updated) {
        throw ApiError.notFound('Account no longer exists');
    }

    res.status(200).json(new ApiResponse(200, stripPassword(updated), 'Profile updated successfully'));
});

// PUT /api/users/me/password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await userModel.findById(req.user.id);
    if (!user) {
        throw ApiError.notFound('Account no longer exists');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
        throw ApiError.unauthorized('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userModel.updatePassword(user.id, passwordHash);

    // Log out every other session — same pattern as the forgot/reset-password flow.
    await refreshTokenModel.revokeAllForUser(user.id);

    res.status(200).json(new ApiResponse(200, null, 'Password changed successfully, please log in again'));
});

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
};