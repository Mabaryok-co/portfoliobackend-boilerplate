const joi = require("joi");
const editorJS_schema = require("./editorSchema");

const ProjectSchemaJOI = joi.object(
  {
    title: joi.string().required(),
    description: editorJS_schema.required(), // Object from editorJS
    technology: joi.string().required(),
    year: joi
      .string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])$/)
      .required()
      .custom((value, helpers) => {
        const [year, month] = value.split("-").map(Number);
        const inputDate = new Date(year, month - 1); // Month start from 0
        const now = new Date();
        now.setDate(1); // Compare Month

        if (inputDate > now) {
          return helpers.error("any.invalid");
        }

        return value;
      })
      .messages({
        "string.pattern.base": 'Format harus "YYYY-MM", contoh: 2025-04',
        "any.invalid": "Tanggal tidak boleh di masa depan.",
      }),
    link: joi.string().uri().optional().allow(""),
  },
  { timestamps: true }
);

module.exports = ProjectSchemaJOI;
