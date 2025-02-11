const path = require("path");
const fs = require("fs");

// Fungsi untuk menghapus semua file yang diunggah jika terjadi error
exports.deleteUploadedFiles = async function (files) {
  if (!files) return;
  const deleteTasks = [];

  if (files.image?.length) {
    deleteTasks.push(
      this.deleteFile(
        `public/assets/upload_by_user/image/${files.image[0].filename}`
      )
    );
  }
  if (files.cv?.length) {
    deleteTasks.push(
      this.deleteFile(`public/assets/upload_by_user/cv/${files.cv[0].filename}`)
    );
  }

  await Promise.all(deleteTasks);
};

exports.deleteFile = async function (filePath) {
  if (!filePath) return;
  const fullPath = path.join(__dirname, "../../", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) console.error(`Gagal menghapus file: ${filePath}`, err);
  });
};
