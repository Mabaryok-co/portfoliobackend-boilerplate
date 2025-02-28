const express = require("express");
const router = express.Router();
const { limiters } = require("@middleware/rateLimiter");

const auth = require("./auth_route");
const user = require("./user_route");
const ai = require("./ai_route");
const projectEntry = require("./projectEntry_route");

router.use("/auth", limiters.auth, auth);
router.use("/user", user);
router.use("/ai", limiters.api_ai, ai);
router.use("/project", limiters.api, projectEntry);

router.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "✅V1 Endpoint Running",
  });
});

module.exports = router;
