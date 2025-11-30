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

/* eslint-disable no-unused-vars 
   ----
   4 parameters are essential for Express to recognize the function as error-handling middleware.*/
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
}
/* eslint-enable no-unused-vars */

module.exports = {
  ApiError,
  errorHandler,
};
