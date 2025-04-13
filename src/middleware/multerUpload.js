const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const tryCatch = require("@tryCatch");
const AppError = require("@AppError");

const uploadPath = {
  cv_file: path.join(__dirname, "../../public/assets/upload_by_user/cv_file"),
  profile_image: path.join(
    __dirname,
    "../../public/assets/upload_by_user/profile_image"
  ),
  project_thumbnail_image: path.join(
    __dirname,
    "../../public/assets/upload_by_user/thumbnail_image"
  ),
};
const validFieldname = Object.keys(uploadPath);

/** ======================= MULTER CONFIG ======================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = uploadPath[file.fieldname];

    if (!destPath) {
      return cb(
        new AppError(
          `Upload File Field are not valid. Only accepts fields with name : ${validFieldname.join(
            ", "
          )}. Read API docs for full information`
        )
      );
    }

    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + uuidv4() + `${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5242880,
  }, //5Mb allowed
  fileFilter: function (req, file, cb) {
    const acceptedMimeTypes = {
      file: ["application/pdf"],
      image: ["image/jpg", "image/png", "image/webp", "image/jpeg"],
    };

    const fieldInFile = file.fieldname.split("_");
    let allowedMimeType;

    if (acceptedMimeTypes[fieldInFile[fieldInFile.length - 1]]) {
      allowedMimeType = acceptedMimeTypes[fieldInFile[fieldInFile.length - 1]];
    } else {
      return cb(
        new AppError(
          `Upload File Field are not valid. Only accepts fields with name : ${validFieldname.join(
            ", "
          )}. Read API docs for full information`
        )
      );
    }

    if (allowedMimeType.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new AppError(
        `Invalid file type for "${
          file.fieldname
        }". Allowed Formats : ${allowedMimeType.join(" ,")}`
      )
    );
  },
});

/** ======================= END MULTER CONFIG ======================= */

module.exports = { upload, uploadPath, validFieldname };
