const logger = require("@logger/logger");
const config = require("@config");
const Redis = require("ioredis");
const { connect } = require("mongoose");
const { RouteError } = require("../handler/errorHandlers");

let delay = config.redis.retryMultiplier;

const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  connectTimeout: config.redis.timeout,
  retryStrategy: (times) => {
    delay = Math.min(times * config.redis.retryMultiplier, 10000);
    logger.warn(`🔄 Redis Retry in ${delay / 1000} seconds...`);
    return delay;
  },
});

// Wait Redis Until Ready
const checkRedis = async () => {
  return new Promise((resolve, reject) => {
    redisClient.on("connect", () => {
      logger.info("✅ Redis Connected");
      resolve();
    });

    redisClient.once("error", (err) => {
      logger.warn(`❌ Redis Connection Error: ${err.message}`);
    });
  });
};

// Retry if redis disconnected
redisClient.on("end", () => {
  logger.warn("⚠️ Redis Disconnected! Retrying...");
  checkRedis();
});

module.exports = { redisClient, checkRedis };
