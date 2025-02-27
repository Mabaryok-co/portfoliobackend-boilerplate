const mongoose = require("mongoose");
const config = require("@config");
const setup_first_user = require("./handler/setup_first_user");
const logger = require("@logger/logger");

let isTryConnect = true;

const connectDB = async () => {
  const DB_NAME = config.database.mongo.dbName ?? "DB_Web_Portofolio";
  // Cek apakah sudah terkoneksi
  if (mongoose.connection.readyState === 1) {
    console.log("⚡ MongoDB sudah terkoneksi");
    return;
  }

  if (isTryConnect) {
    try {
      await mongoose.connect(config.database.mongo.uri, {
        serverSelectionTimeoutMS: config.database.mongo.retry * 2,
        dbName: DB_NAME,
      });
      logger.info("✅ Mongo Connected");
      isTryConnect = false;
      await setup_first_user.createUser();
      return;
    } catch (error) {
      logger.error(error);
      logger.warn(
        `🔄 Retrying database in ${
          config.database.mongo.retry / 1000
        } seconds...`
      );
      await new Promise((resolve) =>
        setTimeout(resolve, config.database.mongo.retry)
      );
    }
  }
};

mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ MongoDB is not connected! Trying to reconnect...");
  isTryConnect = true;
  connectDB();
});

module.exports = connectDB;
