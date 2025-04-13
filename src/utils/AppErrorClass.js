class AppError extends Error {
  constructor(
    message,
    status = 400,
    details = undefined,
    errorCode = undefined
  ) {
    super(message);
    this.status = status;
    this.details = details;
    this.errorCode = errorCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
