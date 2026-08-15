const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an express-validator chain (e.g. from validators/auth.validator.js).
 * Collects any validation errors and throws a single 400 ApiError with the
 * full list — controllers stay clean, no manual validationResult() calls.
 */
function validate(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const formatted = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
    }));

    next(ApiError.badRequest('Validation failed', formatted));
}

module.exports = validate;