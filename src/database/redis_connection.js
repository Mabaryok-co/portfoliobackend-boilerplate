const Redis = require("ioredis");
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const checkRedis = async () => {
  await redisClient.on("connect", () => console.log("✅ Redis Connected"));
  await redisClient.on("error", (err) => {
    console.error("❌ Redis Connection Error : ", err);
    process.exit(1);
  });
};

module.exports = { redisClient, checkRedis };
