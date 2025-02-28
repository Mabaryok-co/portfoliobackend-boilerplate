const joi = require("joi");
const { noSpace } = require("@validator/space");
const editorJS_schema = require("./editorSchema");

const ProjectSchema = joi.object(
  {
    title: joi.string().required(),
    description: editorJS_schema.required(), //Object from editorJS
    technology: joi.string().required(),
  },
  { timestamps: true }
);

module.exports = ProjectSchema;
