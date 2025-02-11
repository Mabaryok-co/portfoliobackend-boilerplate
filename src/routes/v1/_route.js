const express = require("express");
const router = express.Router();

const auth = require("./auth_route");
const user = require("./user_route");

router.use("/auth", auth);
router.use("/user", user);

router.get("/", (req, res) => {
  res.status(200).send({
    status: true,
    message: "✅V1 Endpoint Running",
  });
});

module.exports = router;
