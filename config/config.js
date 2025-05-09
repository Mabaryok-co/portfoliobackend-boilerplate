const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const joi = require("joi");
const Joi = require("joi");
const crypto = require("crypto");

dotenv.config({ path: path.join(__dirname, "../.env") });

const ENV_SCHEMA = Joi.object({
  APP_NAME: Joi.string().required(),
  NODE_ENV: Joi.string()
    .lowercase()
    .valid("development", "production")
    .required(),
  APP_PORT: Joi.number().required(),
  APP_URL: Joi.string().default(6379).required(),
  APP_ENC_KEY: Joi.string()
    .default(crypto.randomBytes(128).toString("hex"))
    .required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379).required(),
  REDIS_PASSWORD: Joi.string().optional().allow(""),
  REDIS_RETRY_STRATEGY_MULTIPLIER_IN_MS: Joi.string().default(1000),

  FRONTEND_URL: Joi.string().uri().optional().allow(""),
  EXTRA_ORIGINS_: Joi.string().uri().optional().allow(""),

  MONGO_URI: Joi.string().required(),
  DB_NAME: Joi.string().default("portfolio-cv").required(),
  MONGO_RETRY_IN_MS: joi.number().default(2000),

  JWT_SECRET: Joi.string()
    .default(crypto.randomBytes(64).toString("hex"))
    .required(),
  JWT_EXPIRATION_MINUTES: Joi.number().default(120).required(),

  AI_API_KEY: Joi.string().required(),
  AI_BASE_URL: Joi.string().uri().required(),

  LOG_DIR: Joi.string().optional().allow(""),
  LOG_LEVEL: Joi.string()
    .lowercase()
    .valid("debug", "info", "verbose", "http", "warn", "error")
    .default("info")
    .required(),
  LOG_MAX_SIZE_IN_MB: Joi.number().default(14).required(),
  LOG_MAX_AGE_IN_DAYS: Joi.number().default(7).required(),
  LOG_ZIPPED: Joi.boolean().default(false),
  LOG_FREQUENCY: Joi.string()
    .valid("daily", "hourly")
    .default("daily")
    .required(),
}).unknown();

const { value: env, error } = ENV_SCHEMA.validate(process.env);
if (error) throw new Error(`Config Validation error: ${error.message}`);

const config = {
  env: env.NODE_ENV,
  port: env.APP_PORT,
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
  ai: {
    apiKey: env.AI_API_KEY,
    baseUrl: env.AI_BASE_URL,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    retryMultiplier: env.REDIS_RETRY_STRATEGY_MULTIPLIER_IN_MS,
  },
  database: {
    mongo: {
      uri: env.MONGO_URI,
      dbName: env.DB_NAME,
      retry: env.MONGO_RETRY_IN_MS,
    },
  },
  cors: {
    frontend: env.FRONTEND_URL,
    extraOrigins: env.EXTRA_ORIGINS,
  },
};

module.exports = config;
