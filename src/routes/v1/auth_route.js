const express = require("express");
const { verifyToken } = require("@middleware/token");
const authHandler = require("@handler/auth_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const router = express.Router();
const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.post("/login", bodyNotEmpty, tryCatch(authHandler.login));

router.use("", verifyToken, privateRoute);
privateRoute.post("/logout", tryCatch(authHandler.logout));

module.exports = router;
