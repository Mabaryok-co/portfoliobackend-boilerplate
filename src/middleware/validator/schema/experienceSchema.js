const joi = require("joi");

const ExperienceSchemaJOI = joi.object({
  title: joi.string().required(),
  position: joi.string().required(),
  type: joi.string().valid("organizational", "job").required(),
  description: joi.string().required(),
  startDate: joi.date().required(),
  endDate: joi.date().required(),
});

module.exports = ExperienceSchemaJOI;
