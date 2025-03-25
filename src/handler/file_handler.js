const path = require("path");
const fs = require("fs");
const AppError = require("@AppError");
const UserModel = require("@models/user");
const ProjectModel = require("@models/project");
const { uploadPath, validFieldname } = require("../middleware/multerUpload");
const mongoose = require("mongoose");
const logger = require("@logger/logger");

//Function to delete all uploaded file in req.files by multer
exports.deleteUploadedReqFiles = async function (files) {
  if (!files) return;
  const deleteTasks = [];

  console.log("Delete Req Files Called");

  Object.keys(files).forEach((keysValue) => {
    const pathToDelete = uploadPath[keysValue];
    if (pathToDelete) {
      deleteTasks.push(
        this.deleteFileUploadedByUser(
          pathToDelete,
          files[keysValue][0].filename
        )
      );
    }
  });

  await Promise.all(deleteTasks);
};

exports.deleteFileUploadedByUser = async function (filePath, file) {
  console.log("Delete Uploaded File Called");
  if (
    !filePath ||
    !filePath.startsWith(
      path.join(__dirname, "../../public/assets/upload_by_user")
    ) ||
    file == "null"
  )
    return;

  console.log(filePath, file);

  fs.unlink(path.join(filePath, file), (err) => {
    if (err) logger.error(`Gagal menghapus file: ${filePath}`, err);
  });
};

async function GetUserProfileData(id) {
  const userProfileData = await UserModel.findById(id);
  if (!userProfileData) {
    throw new AppError("Profile Data not found or deleted");
  }
  return userProfileData;
}

async function GetProjectData(id) {
  const projectData = await ProjectModel.findById(id);
  console.log(projectData);
  if (!projectData) {
    throw new AppError("Project not found or deleted");
  }
  return projectData;
}

// exports.fileUpload = async (req, res) => {
//   const fileUploaded = req.files;
//   if (!fileUploaded) {
//     throw new AppError("File are failed to upload", 500);
//   }
//   const KeysObjInFiles = Object.keys(fileUploaded);
//   KeysObjInFiles.map((value) => {
//     fileUploaded[value] = fileUploaded[value][0].path
//       .replace(path.join(__dirname, "../../public"), "")
//       .split(path.sep)
//       .join("/");
//   });

//   return res.status(200).send({
//     success: true,
//     message: "File Uploaded",
//     data: fileUploaded,
//   });
// };

//TODO: Flow Berubah, jadi data terlebih dahulu masuk, jika berhasil baru file di upload
//TODO: File Upload harus menerima parameter ID, dan Field sesuai apakah CV atau Profile Image/Thumbnail
//Endpoint ini meneriima untuk update dan create new.
//Request harus terdapat idpo
//Jika field yang diupload merupakan cv_file dan profile_image maka mengambil data dari GetUserProfileData. Masukkan path file ke profile data sesuai dengan fieldnya
//Jika field yang diupload merupakan project_thumbnail_image, maka ambil data dari GetProjectData. Masukan path file ke database
//Lalu ketika dari data yang didapatkan sudah ada path nya (selain path default gambar), maka hapus file sebelumnya
//Jike terjadi error, maka hapus file yang terupload
exports.fileUpload = async (req, res, next) => {
  try {
    const fileSuccessUploaded = req.files;
    if (Object.keys(fileSuccessUploaded).length == 0) {
      throw new AppError("Please attach file to upload", 400);
    }

    const { id } = req.body;
    if (!id) {
      await this.deleteUploadedReqFiles(req.files);
      throw new AppError("Please add ID", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      await this.deleteUploadedReqFiles(req.files);
      throw new AppError(
        "Invalid ID format. Must be a valid MongoDB ObjectId."
      );
    }

    let fileDataSaved = [];

    for (const keysValue of Object.keys(fileSuccessUploaded)) {
      const fileData = fileSuccessUploaded[keysValue][0];
      const pathToDelete = uploadPath[keysValue];

      let dataFromDB;
      if (
        fileData.fieldname == "cv_file" ||
        fileData.fieldname == "profile_image"
      ) {
        dataFromDB = await GetUserProfileData(id);
      } else if (fileData.fieldname == "project_thumbnail_image") {
        console.log("project terpanggil");
        dataFromDB = await GetProjectData(id);
      }

      let lastUploadedFilename;
      if (fileData.fieldname == "cv_file") {
        lastUploadedFilename = String(dataFromDB[keysValue].url);
        dataFromDB[keysValue].url = fileData.filename;
      } else {
        lastUploadedFilename = String(dataFromDB[keysValue]);
        dataFromDB[keysValue] = fileData.filename;
      }

      await dataFromDB.save();

      if (!lastUploadedFilename.startsWith("https")) {
        await this.deleteFileUploadedByUser(pathToDelete, lastUploadedFilename);
      }
      fileDataSaved.push({ [keysValue]: dataFromDB[keysValue] });
    }

    return res.status(200).send({
      success: true,
      message: "File Successfully Uploaded",
      data: fileDataSaved,
    });
  } catch (error) {
    return next(error);
  }
};
