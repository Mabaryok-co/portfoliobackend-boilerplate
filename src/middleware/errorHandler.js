const getErrorResponse = require("@getErrorResponse");
const logger = require("@logger/logger");
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = error.message;
  error.stack = err.stack;

  const { statusCode, errorCode, message, details } = getErrorResponse(err);

  const response = {
    success: false,
    ...(errorCode && { errorCode }),
    message,
    ...(process.env.NODE_ENV === "development" && details && { details }),
  };

  console.error(err);
  if (statusCode == 500) {
    logger.error(err);
  } else {
    logger.warn(err);
  }

  return res.status(statusCode).send(response);
};

module.exports = errorHandler;
