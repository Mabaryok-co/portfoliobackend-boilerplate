const express = require("express");
const { upload, uploadMiddleware } = require("@middleware/multerUpload");
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/file_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const router = express.Router();
const privateRoute = express.Router();

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/upload",
  upload.fields([
    { name: "cv_file", maxCount: 1 },
    { name: "profile_image", maxCount: 1 },
    { name: "project_thumbnail_image", maxCount: 1 },
  ]),
  handler.fileUpload
);

module.exports = router;
