const joi = require("joi");
const { noSpace } = require("@validator/space");
const { editorJS_schema } = require("./editorSchema");

const ProjectSchema = joi.object(
  {
    title: joi.string().custom(noSpace).required(),
    description: editorJS_schema.required(), //Object from editorJS
    technology: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = ProjectSchema;
