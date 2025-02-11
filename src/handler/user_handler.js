const fileHandler = require("./file_handler");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const { redisClient } = require("../database/redis_connection");

exports.getProfile = async function (req, res) {
  try {
    res.status(200).send({
      status: true,
      message: "Berhasil Ambil User",
      data: req.userSession,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.getProfilePublic = async function (req, res) {
  try {
    const user = await UserModel.find().select([
      "-password",
      "-_id",
      "-username",
      "-__v",
      "-createdAt",
      "-updatedAt",
    ]);
    res.status(200).send({
      status: true,
      message: "Berhasil Ambil User",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    if (Object.keys(req.body).length === 0)
      throw new Error("Body Tidak Boleh Kosong");
    if (req.body.username || req.body.password) {
      await fileHandler.deleteUploadedFiles(req.files);
      throw new Error(
        "Endpoint ini tidak bisa digunakan untuk mengubah username dan password"
      );
    }
    const data = req.body;

    //Jika user mengupdate Image atau CV. Maka hapus file yang sudah ada sebelumnya
    if (req.files && Object.keys(req.files).length > 0) {
      if (Array.isArray(req.files.image) && req.files.image.length > 0) {
        data.image =
          "public/assets/upload_by_user/image/" + req.files.image[0].filename;
        await fileHandler.deleteFile(req.userSession.user.image);
      }

      if (Array.isArray(req.files.cv) && req.files.cv.length > 0) {
        data.cv = {
          url: "public/assets/upload_by_user/cv/" + req.files.cv[0].filename,
        };
        await fileHandler.deleteFile(req.userSession.user.cv.url);
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
      status: true,
      message: "Profil Berhasil Diubah",
      data: userObj,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.downloadCV = async function (req, res) {
  try {
    //Karena cuman ada 1 user disini dan pakai find ambil satu dan cari id yang paling lama dibuat (pertama)
    const user = await UserModel.findOne().sort({ _id: 1 });
    const cv = user.cv.url;
    if (!cv) throw new Error("CV Tidak Ditemukan");
    user.cv.download += 1;
    await user.save();
    res.download(cv);
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.updateAccount = async function (req, res) {
  try {
    //TODO: Endpoint ubah username dan password
    if (Object.keys(req.body).length === 0)
      throw new Error("Body Tidak Boleh Kosong");

    const data = req.body;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await UserModel.findOneAndUpdate(
      { _id: req.userSession.user._id },
      data,
      { new: true }
    );
    if (!user)
      throw new Error(
        "User Tidak Ditemukan. Pastikan Token Valid atau User memang telah dihapus"
      );

    await user.save();
    userObj = user.toObject();
    delete userObj.password;
    await redisClient.del(`session:${req.userSession.user._id}`);
    res.status(200).send({
      status: true,
      message: "Profile Berhasil di Update Silahkan Login Kembali",
      data: userObj,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
