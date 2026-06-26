class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // capture stack trace (clean debugging)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;