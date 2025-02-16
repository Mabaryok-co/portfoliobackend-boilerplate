const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const joi = require("joi");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const ENV_SCHEMA = Joi.object({
  APP_NAME: Joi.string().required(),
  NODE_ENV: Joi.string().valid("development", "production").required(),
  PORT: Joi.number().default(3000),
  APP_URL: Joi.string().required(),
  APP_ENC_KEY: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  REDIS_CONNECTION_TIMEOUT_IN_MS: Joi.number().default(5000),
  REDIS_RETRY_STRATEGY_MULTIPLIER_IN_MS: Joi.string().default(1000),

  ALLOWED_ORIGINS: Joi.string().required(),

  MONGO_URI: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_MINUTES: Joi.number().required(),

  LOG_DIR: Joi.string().optional().allow(""),
  LOG_LEVEL: Joi.string()
    .valid("debug", "info", "verbose", "http", "warn", "error")
    .required(),
  LOG_MAX_SIZE_IN_MB: Joi.number().required(),
  LOG_MAX_AGE_IN_DAYS: Joi.number().required(),
  LOG_ZIPPED: Joi.boolean().default(false),
  LOG_FREQUENCY: Joi.string().valid("daily", "hourly").required(),
}).unknown();

const { value: env, error } = ENV_SCHEMA.validate(process.env);
if (error) throw new Error(`Config Validation error: ${error.message}`);

const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  appName: env.APP_NAME,
  appUrl: env.APP_URL,
  appSecret: env.APP_ENC_KEY,
  log: {
    directory: env.LOG_DIR,
    level: env.LOG_LEVEL,
    maxSize: env.LOG_MAX_SIZE_IN_MB,
    maxAge: env.LOG_MAX_AGE_IN_DAYS,
    zipped: env.LOG_ZIPPED,
    freq: env.LOG_FREQUENCY,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiration: env.JWT_EXPIRATION_MINUTES,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    timeout: env.REDIS_CONNECTION_TIMEOUT_IN_MS,
    retryMultiplier: env.REDIS_RETRY_STRATEGY_MULTIPLIER_IN_MS,
  },
  database: {
    mongo: {
      uri: env.MONGO_URI,
      dbName: env.DB_NAME,
    },
  },
  cors: {
    allowedOrigins: env.ALLOWED_ORIGINS,
  },
};

module.exports = config;
