const ErrorCodes = require("@errorCode");

const mapJoiErrorCode = (type) => {
  if (type.includes("required")) return ErrorCodes.VALIDATION_MISSING_FIELD;
  if (type.includes("format") || type.includes("pattern"))
    return ErrorCodes.VALIDATION_INVALID_FORMAT;
  if (type.includes("min") || type.includes("max") || type.includes("length"))
    return ErrorCodes.VALIDATION_OUT_OF_RANGE;
  if (type.includes("valid") || type.includes("allowOnly"))
    return ErrorCodes.VALIDATION_INVALID_OPTION;
  if (type.includes("type")) return ErrorCodes.VALIDATION_TYPE_MISMATCH;
  return ErrorCodes.VALIDATION_CONSTRAINT_FAILED;
};

const JoiErrorRules = [
  {
    check: (e) => e.isJoi,
    response: (e) => ({
      statusCode: 400,
      errorCode: mapJoiErrorCode(e.details[0]?.type),
      message: e.details[0]?.message || "Validasi gagal",
      details: e.details.map((detail) => ({
        field: detail.context?.key,
        message: detail.message,
        value: detail.context?.value,
      })),
    }),
  },
];

module.exports = JoiErrorRules;
