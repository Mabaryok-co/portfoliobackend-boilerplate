//Avoid Repetitive try catch block in route controller/handler
const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    return next(error);
  }
};

module.exports = tryCatch;
