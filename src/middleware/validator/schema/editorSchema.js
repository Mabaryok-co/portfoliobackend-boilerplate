const joi = require("joi");

const editorJSBlock_schema = joi.object({
  type: joi.string().required(),
  data: joi.object().required(),
});

const editorJS_schema = joi.object({
  time: joi.number(),
  blocks: joi.array().items(editorJSBlock_schema).required(),
  version: joi.string(),
});

module.exports = editorJS_schema;
