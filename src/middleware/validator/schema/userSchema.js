const joi = require("joi");
const { noSpace } = require("@validator/space");

// All In One User Schema (Use options pick or fork to customize schema when validating using JoiValidator() method)
exports.userSchema = joi.object({
  username: joi.string().custom(noSpace).alphanum().required(),
  password: joi
    .string()
    .custom(noSpace)
    .pattern(/^[A-Za-z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]+$/)
    .message(
      "Password hanya boleh berisi huruf, angka, dan simbol yang ada di keyboard"
    )
    .required(),
  name: joi.string().required(),
  bio: joi.string().required(),
  social: joi.array().items(
    joi.object({
      app_name: joi.string().required(),
      link: joi.string().uri().required(),
    })
  ),
  contact: joi.string().required(),
  image: joi.string().uri().required(),
  cv: joi.object({
    url: joi.string().uri(),
    download: joi.number(),
  }),
});
