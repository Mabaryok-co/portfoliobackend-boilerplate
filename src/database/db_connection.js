const mongoose = require("mongoose");
const dotenv = require("dotenv");
const setup_first_user = require("./handler/setup_first_user");
dotenv.config();

const connectDB = async () => {
  const DB_NAME = process.env.DB_NAME ?? "DB_Web_Portofolio";
  await mongoose.disconnect();
  await mongoose
    .connect(process.env.MONGO_URI, {
      dbName: DB_NAME,
    })
    .then(async () => {
      console.log("✅ Mongo Connected");
      await setup_first_user.createUser();
    })
    .catch((error) => {
      console.log(process.env.MONGO_URI);
      console.error("❌ MongoDB Connection Error : ", error);
      process.exit(1);
    });
};

module.exports = connectDB;
