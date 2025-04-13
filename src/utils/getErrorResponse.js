const AppError = require("./AppErrorClass");
const errorRules = require("./error_rules/error_rules_index");
const ErrorCodes = require("./errorCode");

const getErrorResponse = (err) => {
  //Default Error Information if there is unknown error
  const defaultResponse = {
    statusCode: 500,
    errorCode: ErrorCodes.APP_UNHANDLED_EXCEPTION,
    message: err.message || "Terjadi kesalahan pada server",
    details: null,
  };

  if (err instanceof AppError) {
    const response = {
      statusCode: err.status,
      errorCode: err.errorCode || null,
      message: err.message,
      details: err.errorDetails || null,
    };
    return response;
  }

  const matchError = errorRules.find((rule) => rule.check(err));

  if (matchError) {
    return typeof matchError.response == "function"
      ? matchError.response(err)
      : matchError.response;
  } else {
    return defaultResponse;
  }
};

module.exports = getErrorResponse;
