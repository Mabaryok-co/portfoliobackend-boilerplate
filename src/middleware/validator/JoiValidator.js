const joi = require("joi");
const { RouteError } = require("@handler/errorHandlers");

// Only Select Some Attributes in schmea. Example: JoiValidator(userSchema, value, { pick: ['username', 'password'] });
const pickAttributes = (schema, attributes) => {
  const picked = attributes.reduce((result, attr) => {
    if (schema.describe().keys[attr]) {
      result[attr] = schema.extract(attr);
    }
    return result;
  }, {});
  return joi.object(picked);
};

// Only Exclude Some Attributes in Schema. Example: JoiValidator(userSchema, value, { fork: ['bio', 'social'] });
const forkAttributes = (schema, attributes) => {
  return schema.fork(attributes, (schema) => schema.strip());
};

// Validate with options
const JoiValidator = (schema, value, options = {}) => {
  let modifiedSchema = schema;

  if (options.pick) {
    modifiedSchema = pickAttributes(modifiedSchema, options.pick);
  }

  if (options.fork) {
    modifiedSchema = forkAttributes(modifiedSchema, options.fork);
  }

  console.log(modifiedSchema.keys);

  const { value: valid, error } = modifiedSchema.validate(value);
  if (error) throw RouteError(`Schema Validation error: ${error.message}`);

  return valid;
};

module.exports = JoiValidator;
