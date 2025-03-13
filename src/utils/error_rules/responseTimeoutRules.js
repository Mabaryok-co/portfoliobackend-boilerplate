const ErrorCodes = require("@errorCode");

const responseTimeoutRules = [
  {
    check: (e) => e.message == "Response timeout",
    response: (e) => ({
      statusCode: 500,
      errorCode: ErrorCodes.APP_SERVICE_ERROR,
      message: `Response timeout after ${
        e.timeout / 1000
      }s. Sorry For the Inconvinience`,
    }),
  },
];

module.exports = responseTimeoutRules;
