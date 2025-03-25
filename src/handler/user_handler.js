const fileHandler = require("./file_handler");
const UserModel = require("@models/user");
const bcrypt = require("bcrypt");
const { redisClient } = require("@database/redis_connection");
const AppError = require("@AppError");
const JoiValidator = require("@validator/JoiValidator");
const userSchema = require("@validator/schema/userSchema");

exports.getProfile = async function (req, res) {
  //Karena ini website cuman satu user. Jadi langsung ambil aja
  const user = await UserModel.find().select([
    "-password",
    "-username",
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
    //Jika ada kesalahan, maka hapus file yang sudah di upload multer
    await fileHandler.deleteUploadedReqFiles(req.files);
    throw AppError(
      "Endpoint ini tidak bisa digunakan untuk mengubah username dan password"
    );
  }

  const fieldsToUpdate = Object.keys(req.body);
  // Validate only the fields that are being updated
  const data = JoiValidator(userSchema, req.body, { pick: fieldsToUpdate });

  //Jika user mengupdate Profile Image atau CV. Maka hapus file yang sudah ada sebelumnya
  if (req.files && Object.keys(req.files).length > 0) {
    if (
      Array.isArray(req.files.profile_image) &&
      req.files.profile_image.length > 0
    ) {
      data.profile_image =
        "public/assets/upload_by_user/profile_image/" +
        req.files.profile_image[0].filename;
      await fileHandler.deleteFileUploadedByUser(req.userSession.user.image);
    }

    if (Array.isArray(req.files.cv_file) && req.files.cv.length > 0) {
      data.cv = {
        url: "public/assets/upload_by_user/cv/" + req.files.cv[0].filename,
      };
      await fileHandler.deleteFileUploadedByUser(req.userSession.user.cv.url);
    }
  }

  if (data.social) {
    data.social = JSON.parse(data.social);
  }
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
  try {
    //Karena cuman ada 1 user disini dan pakai find ambil satu dan cari id yang paling lama dibuat (pertama)
    const user = await UserModel.findOne().sort({ _id: 1 });
    const cv = user.cv.url;
    if (!cv) throw new AppError("CV Tidak Ditemukan");
    user.cv.download += 1;
    await user.save();
    res.download(cv);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
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
