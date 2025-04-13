const {
  MongoServerError,
  MongoNetworkError,
  MongoOperationTimeoutError,
} = require("mongodb");
const mongoose = require("mongoose");
const ErrorCodes = require("@errorCode");

const mongooseErrorRules = [
  /**
   * Mongo Cast Error
   */
  {
    check: (e) =>
      e instanceof mongoose.Error.CastError && e.kind === "ObjectId",
    response: {
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_INVALID_OBJECT_ID,
      message: "ID tidak valid",
    },
  },
  {
    check: (e) => e instanceof mongoose.Error.CastError && e.kind === "Number",
    response: {
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_INVALID_NUMBER,
      message: "Nilai harus berupa angka yang valid",
    },
  },
  {
    check: (e) => e instanceof mongoose.Error.CastError && e.kind === "Boolean",
    response: {
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_INVALID_BOOLEAN,
      message: "Nilai harus berupa true atau false",
    },
  },
  {
    check: (e) => e instanceof mongoose.Error.CastError && e.kind === "Date",
    response: {
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_INVALID_DATE,
      message: "Format tanggal tidak valid",
    },
  },
  {
    check: (e) => e instanceof mongoose.Error.CastError,
    response: {
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_INVALID_CAST,
      message: "Format data tidak sesuai",
    },
  },
  /**
   * Mongo Server Error
   */
  {
    check: (e) => e instanceof MongoServerError && e.code === 11000,
    response: (e) => ({
      statusCode: 400,
      errorCode: ErrorCodes.DB_DUPLICATE_ENTRY,
      message: Object.keys(e.keyValue || {})[0]
        ? `${Object.keys(e.keyValue || {})[0]} already in use`
        : "Duplicate Data Entry",
      details: {
        field: Object.keys(e.keyValue || {})[0],
        value: e.keyValue?.[Object.keys(e.keyValue || {})[0]],
      },
    }),
  },
  /**
   * Mongo Network Error
   */
  {
    check: (e) => e instanceof MongoNetworkError,
    response: {
      statusCode: 503,
      errorCode: ErrorCodes.DB_CONNECTION_FAILED,
      message: "Failed to connect DB",
    },
  },
  /**
   * Mongo Timeout Error
   */
  {
    check: (e) => e instanceof MongoOperationTimeoutError,
    response: {
      statusCode: 504,
      errorCode: ErrorCodes.DB_TIMEOUT,
      message: "Database took too long to response",
    },
  },
];

module.exports = mongooseErrorRules;
