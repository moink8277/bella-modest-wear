/**
 * Standard success response envelope: { success, message, data }.
 * Keep every controller returning this same shape.
 */
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success') {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
