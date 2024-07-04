/**
 * Custom error middleware.
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
  static badInput(message) {
    throw new ApiError(422, message);
  }
  static badMediaType(message) {
    throw new ApiError(415, message);
  }
  static payloadTooLarge(message) {
    throw new ApiError(413, message);
  }
  static notAuthorized(message) {
    throw new ApiError(401, message);
  }
  static notFound(message) {
    throw new ApiError(404, message);
  }
}

function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Something went wrong" });
}

module.exports = {
  ApiError,
  errorHandler,
};
