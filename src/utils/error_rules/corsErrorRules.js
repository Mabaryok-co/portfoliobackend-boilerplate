const ErrorCodes = require("@errorCode");

const corsErrorRules = [
  {
    check: (e) => e.message == "CORS_NOT_ALLOWED",
    response: {
      statusCode: 400,
      errorCode: ErrorCodes.CORS_NOT_ALLOWED,
      message: "Not Allowed By CORS",
    },
  },
];

module.exports = corsErrorRules;
