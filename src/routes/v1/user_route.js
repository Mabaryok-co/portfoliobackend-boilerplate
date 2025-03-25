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
publicRoute.get("/profile", tryCatch(userHandler.getProfile));
publicRoute.get("/download/cv", tryCatch(userHandler.downloadCV));

router.use("", verifyToken, privateRoute);
privateRoute.put("/profile", tryCatch(userHandler.updateProfile)); //Add Multer Upload File Image & CV
privateRoute.patch(
  "/profile/account/update",
  bodyNotEmpty,
  tryCatch(userHandler.updateAccount)
);

module.exports = router;
