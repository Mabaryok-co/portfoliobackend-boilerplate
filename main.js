const app = require("./src/app");
const config = require("./config/config");
const logger = require("./library/logger/logger");
const { checkRedis } = require("./src/database/redis_connection");
const connectDB = require("./src/database/db_connection");

//Server Handler

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(`Unexpected Error: ${error}`);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//Start Server
async function startServer() {
  process.server = app.listen(config.port, async () => {
    await checkRedis();
    await connectDB();
    logger.info(`Server Berjalan Pada ${config.appUrl}:${config.port}`);
  });
}

startServer();
