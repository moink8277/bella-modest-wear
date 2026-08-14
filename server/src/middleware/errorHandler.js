const env = require('../config/env');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    error = new ApiError(statusCode, error.message || 'Internal server error');
  }

  if (!env.isProduction) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, err.message);
  } else if (error.statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${err.message}`);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    errors: error.errors || undefined,
    stack: env.isProduction ? undefined : err.stack,
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
  });
}

module.exports = { errorHandler, notFoundHandler };
