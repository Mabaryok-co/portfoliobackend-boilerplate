require("module-alias/register");
const app = require("./src/app");
const config = require("@config");
const logger = require("@logger/logger");
const { checkRedis } = require("./src/database/redis_connection");
const connectDB = require("./src/database/db_connection");

//Server Handler

const exitHandler = () => {
  if (process.server) {
    process.server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//Start Server
async function startServer() {
  await checkRedis();
  await connectDB();
  process.server = app.listen(config.port, async () => {
    logger.info(`Server Berjalan Pada ${config.appUrl}:${config.port}`);
  });
}

startServer();
