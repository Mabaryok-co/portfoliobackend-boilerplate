const AppError = require("@AppError");

/**
 * Middleware untuk memeriksa apakah request body kosong.
 *
 * Jika body kosong, akan mengembalikan error 400 (Bad Request).
 * Jika body tidak kosong, request akan diteruskan ke middleware atau handler berikutnya.
 *
 * @function bodyNotEmpty
 */
exports.bodyNotEmpty = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new AppError("Body Tidak Boleh Kosong", 400));
  }
  next();
};
