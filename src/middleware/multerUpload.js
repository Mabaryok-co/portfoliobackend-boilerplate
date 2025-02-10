const multer = require("multer");
const path = require("path");

const cv_path = path.join(__dirname, "../../public/assets/upload_by_user/cv");
const image_profile_path = path.join(
  __dirname,
  "../../public/assets/upload_by_user/image"
);

/** ======================= MULTER CONFIG ======================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, image_profile_path);
    } else if (file.fieldname === "cv") {
      cb(null, cv_path);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        `-${file.fieldname}-${
          req.userSession ? req.userSession.user.name : "Unknown"
        }${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880,
  }, //5Mb allowed
  // fileFilter: function(req, file,cb) {
  //   //
  // }
});

/** ======================= END MULTER CONFIG ======================= */

module.exports = { upload };
