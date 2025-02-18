const joi = require("joi");
const { noSpace } = require("@validator/space");

exports.userPassSchema = joi.object({
  username: joi.string().custom(noSpace).alphanum().required(),
  password: joi
    .string()
    .custom(noSpace)
    .pattern(/^[A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/)
    .message(
      "Password hanya boleh berisi huruf, angka, dan simbol yang ada di keyboard"
    )
    .required(),
});
