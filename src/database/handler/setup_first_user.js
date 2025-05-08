const UserModel = require("@models/user");
const bcrypt = require("bcrypt");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const logger = require("@logger/logger");
const { noSpace } = require("@validator/space");
const JoiValidator = require("@validator/JoiValidator");
const userSchema = require("@validator/schema/userSchema");

require("dotenv").config();

const CACHE_FILE = path.join(__dirname, "/setup_first_user_done.tmp"); // File untuk menyimpan status setup

function getUserCredential() {
  while (true) {
    const username = process.env.INITIAL_USERNAME;
    const password = process.env.INITIAL_PASSWORD;

    if (!username || !password) {
      throw new Error(
        "INITIAL_USERNAME and INITIAL_PASSWORD are required on first setup."
      );
    }

    return {
      username: username,
      password: password,
    };
  }
}

exports.createUser = async function () {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      logger.info(
        "✅ Setup user sudah dilakukan sebelumnya. Melewatkan proses setup..."
      );
      return;
    }

    const userCount = await UserModel.countDocuments();
    if (userCount == 0) {
      const userData = getUserCredential();
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      userData.password = hashedPassword;
      await UserModel.create(userData);

      logger.info(`✅ [INIT] Default user created`);

      logger.warn(
        "⚠️ Segera ubah data diri anda pada endpoint profile setelah login"
      );

      fs.writeFileSync(CACHE_FILE, "done");
      return;
    }

    logger.info("✅ User Telah Ada. Melanjutkan Server");
    fs.writeFileSync(CACHE_FILE, "done");
    return;
  } catch (error) {
    logger.error(`❌ First Setup User Error : ${error}`);
    process.exit(1);
  }
};
