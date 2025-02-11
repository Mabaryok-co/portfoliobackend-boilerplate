const { redisClient } = require("../database/redis_connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

exports.validator = function (req, res, next) {
  try {
    if (Object.keys(req.body).length === 0)
      throw new Error("Body Tidak Ditemukan");
    if (!req.body.username || !req.body.password)
      throw new Error("Field Username/Password tidak ditemukan dalam body");
    req.body.username = req.body.username.replace(/\s/g, "");
    next();
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.login = async function (req, res) {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username });
    if (!user) throw new Error("Username atau Password salah!");
    if (!(await bcrypt.compare(password, user.password)))
      throw new Error("Username atau Password salah!");

    const token = jwt.sign(
      {
        iid: user._id,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: "2h",
      }
    );

    userObj = user.toObject();
    delete userObj.password;

    await redisClient.set(
      `session:${user._id}`,
      JSON.stringify({
        user: userObj,
        token: token,
      }),
      "EX",
      7200
    );

    res.status(200).send({
      status: true,
      message: "Berhasil Login",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

exports.logout = async function (req, res) {
  try {
    const user = req.userSession;
    await redisClient.del(`session:${user._id}`);
    res.status(200).send({
      status: true,
      message: "Berhasil Logout",
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
