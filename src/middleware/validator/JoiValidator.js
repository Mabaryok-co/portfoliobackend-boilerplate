const joi = require("joi");
const { RouteError } = require("@handler/errorHandlers");

const JoiValidator = (schema, value) => {
  const { value: valid, error } = schema.validate(value);
  if (error) throw RouteError(`Schema Validation error: ${error.message}`);
  return valid;
};

module.exports = JoiValidator;
