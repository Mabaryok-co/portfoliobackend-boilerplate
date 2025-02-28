const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/projectEntry_handler");
const { errorHandlers } = require("@handler/errorHandlers");
const { bodyNotEmpty } = require("@validator/body");

privateRoute = express.Router();

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/new",
  bodyNotEmpty,
  errorHandlers(handler.createProjectEntry)
);

module.exports = router;
