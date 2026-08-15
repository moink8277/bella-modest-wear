const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to specific roles. Must run AFTER `authenticate`
 * (needs req.user already set). Usage: router.get('/x', authenticate, authorize('ADMIN'), handler)
 */
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            throw ApiError.forbidden('You do not have permission to perform this action');
        }
        next();
    };
}

module.exports = { authorize };