const express = require("express");
const router = express.Router();
const { upload } = require("@middleware/multerUpload");
const { verifyToken } = require("@middleware/token");
const userHandler = require("@handler/user_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/profile/public", tryCatch(userHandler.getProfilePublic));
publicRoute.get("/download/cv", tryCatch(userHandler.downloadCV));

router.use("", verifyToken, privateRoute);
privateRoute.patch(
  "/profile/update",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  tryCatch(userHandler.updateProfile)
);
privateRoute.get("/profile", tryCatch(userHandler.getProfile));
privateRoute.patch(
  "/profile/account/update",
  bodyNotEmpty,
  tryCatch(userHandler.updateAccount)
);

module.exports = router;
