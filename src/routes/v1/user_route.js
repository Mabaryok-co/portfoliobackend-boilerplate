const express = require("express");
const router = express.Router();
const { upload } = require("@middleware/multerUpload");
const { verifyToken } = require("@middleware/token");
const userHandler = require("@handler/user_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", verifyToken, privateRoute);
privateRoute.get("/account", tryCatch(userHandler.getAccountDetails));
privateRoute.put("/account", bodyNotEmpty, tryCatch(userHandler.updateAccount));
privateRoute.put("", tryCatch(userHandler.updateProfile));

router.use("", publicRoute);
publicRoute.get("/cv", tryCatch(userHandler.downloadCV));
publicRoute.get("", tryCatch(userHandler.getProfile));

module.exports = router;
