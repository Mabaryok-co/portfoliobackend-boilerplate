const UserModel = require("../../models/user");
const bcrypt = require("bcrypt");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const CACHE_FILE = path.join(__dirname, "/setup_first_user_done.tmp"); // File untuk menyimpan status setup
console.log("Cache File Path: ", CACHE_FILE);

async function input(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.replace(/\s/g, ""));
    });
  });
}

exports.createUser = async function () {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      console.log(
        "✅ Setup user sudah dilakukan sebelumnya. Melewatkan proses setup...\n"
      );
      return;
    }

    const userCount = await UserModel.countDocuments();
    if (userCount > 0) {
      console.log("✅ User Telah Ada. Melanjutkan Server\n");
      fs.writeFileSync(CACHE_FILE, "done");
      return;
    }
    console.log(
      "\n⚠️  Tidak ada user di database. Silakan buat user terlebih dahulu. \n"
    );

    const username = await input("Masukkan username: ");
    const password = await input("Masukkan password: ");
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    console.log(
      "\n✅ User berhasil dibuat! Silahkan login menggunakan akun ini. Mohon lengkapi data diri anda di profile setelah login"
    );
    fs.writeFileSync(CACHE_FILE, "done");
    return;
  } catch (error) {
    console.error("❌ First Setup User Error : ", error);
    process.exit(1);
  }
};
