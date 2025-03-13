const mongooseErrorRules = require("./mongoErrorRules");
const JoiErrorRules = require("./joiErrorRules");
const JWTErrorRules = require("./jwtErrorRules");
const corsErrorRules = require("./corsErrorRules");
const responseTimeoutRules = require("./responseTimeoutRules");

const errorRules = [
  ...corsErrorRules,
  ...responseTimeoutRules,
  ...JoiErrorRules,
  ...JWTErrorRules,
  ...mongooseErrorRules,
];

module.exports = errorRules;
