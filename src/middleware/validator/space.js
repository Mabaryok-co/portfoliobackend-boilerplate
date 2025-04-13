const AppError = require("@AppError");

exports.noSpace = (val, helpers = null) => {
  if (/\s/.test(val)) {
    if (helpers) {
      return helpers.error("any.invalid", {
        message: "Value must not have space",
      });
    }
    throw new AppError("Value must not have space");
  }
  return val;
};
