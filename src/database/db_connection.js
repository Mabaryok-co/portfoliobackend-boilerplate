const mongoose = require("mongoose");
const dotenv = require("dotenv");
const setup_first_user = require("./handler/setup_first_user");
const logger = require("../../library/logger/logger");
dotenv.config();

const connectDB = async () => {
  const DB_NAME = process.env.DB_NAME ?? "DB_Web_Portofolio";
  // Cek apakah sudah terkoneksi
  if (mongoose.connection.readyState === 1) {
    console.log("⚡ MongoDB sudah terkoneksi");
    return;
  }

  await mongoose
    .connect(process.env.MONGO_URI, {
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
