const fileHandler = require("./file_handler");
const UserModel = require("@models/user");
const bcrypt = require("bcrypt");
const { redisClient } = require("@database/redis_connection");
const AppError = require("@AppError");
const JoiValidator = require("@validator/JoiValidator");
const userSchema = require("@validator/schema/userSchema");
const path = require("path");
const { uploadPath } = require("../middleware/multerUpload");

exports.getProfile = async function (req, res) {
  //Karena ini website cuman satu user. Jadi langsung ambil aja
  const user = await UserModel.find().select([
    "-password",
    "-username",
    "-cv_file",
    "-__v",
    "-createdAt",
    "-updatedAt",
  ]);
  res.status(200).send({
    success: true,
    message: "Berhasil Ambil User",
    data: user,
  });
};

exports.updateProfile = async function (req, res) {
  if (req.body.username || req.body.password) {
    throw new AppError(
      "Endpoint ini tidak bisa digunakan untuk mengubah username dan password"
    );
  } else if (req.body.cv_file || req.body.profile_image) {
    throw new AppError(
      "Endpoint ini tidak bisa digunakan untuk mengubah profile image atau cv file"
    );
  }

  const fieldsToUpdate = Object.keys(req.body);
  // Validate only the fields that are being updated
  const data = JoiValidator(userSchema, req.body, { pick: fieldsToUpdate });

  const userUpdated = await UserModel.findOneAndUpdate(
    { _id: req.userSession.user._id },
    data,
    {
      new: true,
    }
  );

  if (!userUpdated) throw new AppError("User Tidak Ditemukan. Gagal Update");

  userObj = userUpdated.toObject();
  delete userObj.password;
  await redisClient.set(
    `session:${req.userSession.user._id}`,
    JSON.stringify({
      user: userObj,
      token: req.headers["authorization"].replace("Bearer ", ""),
    })
  );

  res.status(200).send({
    success: true,
    message: "Profil Berhasil Diubah",
    data: userObj,
  });
};

exports.downloadCV = async function (req, res) {
  //Karena cuman ada 1 user disini dan pakai find ambil satu dan cari id yang paling lama dibuat (pertama)
  const user = await UserModel.findOne().sort({ _id: 1 });
  const cv = path.join(uploadPath.cv_file, user.cv_file.url);
  if (!cv) throw new AppError("CV Tidak Ditemukan");
  user.cv_file.download += 1;
  await user.save();
  res.download(cv);
};

exports.getAccountDetails = async function (req, res) {
  const user = await UserModel.findOne().sort({ _id: 1 });
  const username = user.username;
  res.status(200).send({
    success: true,
    message: "Successfully get username from user",
    data: { username: username },
  });
};

exports.updateAccount = async function (req, res) {
  const pickAttr = Object.keys(req.body);
  const data = JoiValidator(userSchema, req.body, { pick: pickAttr });

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const user = await UserModel.findOneAndUpdate(
    { _id: req.userSession.user._id },
    data,
    { new: true }
  );
  if (!user)
    throw AppError(
      "User Tidak Ditemukan. Pastikan Token Valid atau User memang telah dihapus"
    );

  userObj = user.toObject();
  delete userObj.password;
  await redisClient.del(`session:${req.userSession.user._id}`);
  res.status(200).send({
    success: true,
    message: "Profile Berhasil di Update Silahkan Login Kembali",
    data: userObj,
  });
};
