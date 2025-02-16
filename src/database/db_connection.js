const mongoose = require("mongoose");
const config = require("../../config/config");
const setup_first_user = require("./handler/setup_first_user");
const logger = require("../../library/logger/logger");

const connectDB = async () => {
  const DB_NAME = config.database.mongo.dbName ?? "DB_Web_Portofolio";
  // Cek apakah sudah terkoneksi
  if (mongoose.connection.readyState === 1) {
    console.log("⚡ MongoDB sudah terkoneksi");
    return;
  }

  await mongoose
    .connect(config.database.mongo.uri, {
      dbName: DB_NAME,
    })
    .then(async () => {
      logger.info("✅ Mongo Connected");
      await setup_first_user.createUser();
    })
    .catch((error) => {
      throw new Error(error);
    });
};

module.exports = connectDB;
