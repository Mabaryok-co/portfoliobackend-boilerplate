const express = require("express");
const { verifyToken } = require("../../middleware/token");
const authHandler = require("../../handler/auth_handler");

const router = express.Router();
const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.post("/login", authHandler.validator, authHandler.login);

router.use("", verifyToken, privateRoute);
privateRoute.post("/logout", authHandler.logout);

module.exports = router;
