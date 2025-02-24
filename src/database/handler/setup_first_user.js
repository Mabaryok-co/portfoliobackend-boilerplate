const UserModel = require("@models/user");
const bcrypt = require("bcrypt");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const logger = require("@logger/logger");
const { noSpace } = require("@validator/space");
const JoiValidator = require("@validator/JoiValidator");
const { userSchema } = require("@validator/schema/userSchema");

const CACHE_FILE = path.join(__dirname, "/setup_first_user_done.tmp"); // File untuk menyimpan status setup

async function input(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getUserCredential() {
  while (true) {
    try {
      const username = noSpace(await input("Masukkan username: "));
      const password = noSpace(await input("Masukkan password: "));
      const data = {
        username: username,
        password: password,
      };

      JoiValidator(userSchema, data, { pick: ["username", "password"] });
      return data;
    } catch (error) {
      logger.warn(`Failed To Create User: ${error.message}`);
    }
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
    if (userCount > 0) {
      logger.log("✅ User Telah Ada. Melanjutkan Server");
      fs.writeFileSync(CACHE_FILE, "done");
      return;
    }
    logger.warn(
      "\n⚠️  Tidak ada user di database. Silakan buat user terlebih dahulu."
    );

    const userData = await getUserCredential();

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    await UserModel.create(userDatal);

    logger.info(
      "✅ User berhasil dibuat! Silahkan login menggunakan akun ini. Mohon lengkapi data diri anda di profile setelah login"
    );
    logger.warn("⚠️ Mohon lengkapi data diri anda di profile setelah login");
    fs.writeFileSync(CACHE_FILE, "done");
    return;
  } catch (error) {
    logger.error(`❌ First Setup User Error : ${error}`);
    process.exit(1);
  }
};
