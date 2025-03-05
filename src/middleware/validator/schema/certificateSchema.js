const joi = require("joi");

const CertificateSchemaJOI = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  link: joi.string().uri().required(),
  year: joi.number().min(1950).required(),
});

module.exports = CertificateSchemaJOI;
