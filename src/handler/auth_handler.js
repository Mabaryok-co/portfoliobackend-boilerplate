const { redisClient } = require("../database/redis_connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("@models/user");
const config = require("@config");
const { RouteError } = require("./errorHandlers");
const { noSpace } = require("@validator/space");
const JoiValidator = require("@validator/JoiValidator");
const { userSchema } = require("@validator/schema/userSchema");
const reqIp = require("request-ip");
const { lookup } = require("ip-location-api");
const logger = require("@logger/logger");

// exports.validator = function (req, res, next) {
//   try {
//     if (Object.keys(req.body).length === 0)
//       throw RouteError("Body Tidak Ditemukan");
//     if (!req.body.username || !req.body.password)
//       throw RouteError("Field Username/Password tidak ditemukan dalam body");
//     req.body.username = req.body.username.replace(/\s/g, "");
//     next();
//   } catch (error) {
//     res.status(400).send({
//       status: false,
//       message: error.message,
//     });
//   }
// };

exports.login = async function (req, res) {
  const data = {
    username: noSpace(req.body.username),
    password: noSpace(req.body.password),
  };

  JoiValidator(userSchema, data, { pick: ["username", "password"] });

  const user = await UserModel.findOne({ username: data.username });
  const authError = RouteError("Username atau Password salah!");

  if (!user) {
    throw authError;
  }
  if (!(await bcrypt.compare(data.password, user.password))) {
    throw authError;
  }

  const token = jwt.sign(
    {
      iid: user._id,
    },
    config.jwt.secret,
    {
      expiresIn: `${config.jwt.expiration}m`,
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
  const ipUser = reqIp.getClientIp(req);
  const ipLoc = await lookup(ipUser);

  logger.info(
    `User ${user.username} melakukan login dengan ip ${ipUser} di ${
      ipLoc ? ipLoc.country : "Unknown"
    } \n Menggunakan ${req.headers["user-agent"] ?? "Not detected"}`
  );

  res.status(200).send({
    status: true,
    message: "Berhasil Login",
    token: token,
  });
};

exports.logout = async function (req, res) {
  const user = req.userSession;
  if (!user) {
    throw RouteError("Anda tidak sedang login");
  }
  await redisClient.del(`session:${user._id}`);
  res.status(200).send({
    status: true,
    message: "Berhasil Logout",
  });
};
