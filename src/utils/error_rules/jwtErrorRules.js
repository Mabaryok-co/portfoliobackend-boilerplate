const ErrorCodes = require("@errorCode");

const JWTErrorRules = [
  {
    check: (e) => e.name === "JsonWebTokenError",
    response: {
      statusCode: 401,
      errorCode: ErrorCodes.AUTH_TOKEN_INVALID,
      message: "Token are not valid",
    },
  },
  {
    check: (e) => e.name === "TokenExpiredError",
    response: {
      statusCode: 401,
      errorCode: ErrorCodes.AUTH_TOKEN_EXPIRED,
      message: "Token Expired",
    },
  },
];

module.exports = JWTErrorRules;
