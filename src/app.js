const express = require("express");
const connectDB = require("./database/db_connection");
const bparser = require("body-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const app = express();
const { checkRedis } = require("./database/redis_connection");
const logger = require("../library/logger/logger");

dotenv.config();

app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());
app.use(helmet());

//Gzip compression
app.use(compression());
app.use(cors());
app.options("*", cors());

/**
 * @route Entry Point Semua Route
 */
const route = require("./routes/route");
app.use("", route);

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
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//Start Server
async function startServer() {
  process.server = app.listen(process.env.PORT, process.env.HOST, async () => {
    await checkRedis();
    await connectDB();
    logger.info(
      `Server Berjalan Pada http://${process.env.HOST}:${process.env.PORT}`
    );
  });
}

startServer();
