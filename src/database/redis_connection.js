const logger = require("@logger/logger");
const config = require("@config");
const Redis = require("ioredis");
const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  connectTimeout: config.redis.timeout,
  retryStrategy: (times) => {
    const delay = Math.min(times * config.redis.retryMultiplier, 15000);
    return delay;
  },
});

const checkRedis = async () => {
  await redisClient.on("connect", () => logger.info("✅ Redis Connected"));
  await redisClient.on("error", (err) => {
    logger.error(`❌ Redis Connection Error : ${err}`);
    process.exit(1);
  });
};

module.exports = { redisClient, checkRedis };
