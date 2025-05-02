const joi = require("joi");
const editorJS_schema = require("./editorSchema");

const ExperienceSchemaJOI = joi.object({
  entity: joi.string().required(),
  position: joi.string().required(),
  type: joi.string().valid("organizational", "job").required(),
  description: editorJS_schema.required(), //Object from editorJS
  startDate: joi.date().required().max("now").messages({
    "date.max": `your "startDate" input are in the future you know. Are you time traveler?`,
  }),
  endDate: joi.date().required().less(joi.ref("startDate")).messages({
    "date.greater": `"endDate" must be less than "startDate"`,
  }),
});

module.exports = ExperienceSchemaJOI;
