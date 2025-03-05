const jwt = require("jsonwebtoken");
const { redisClient } = require("../database/redis_connection");
const config = require("@config");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res
      .status(401)
      .send({ success: false, message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), config.jwt.secret);
    const valid = await redisClient.get(`session:${decoded.iid}`);
    if (!valid) throw new Error("Tidak Valid");
    const validParsed = JSON.parse(valid);
    if (validParsed.token != token.replace("Bearer ", "")) throw new Error();
    delete validParsed.token;
    req.userSession = validParsed;
    next();
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .send({ success: false, message: "Invalid token or Expired" });
  }
};

const checkHeader = (req, res, next) => {
  //Mana tau nanti perlu ada header tambahan
};

module.exports = { verifyToken, checkHeader };
