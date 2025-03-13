const JoiValidator = require("@validator/JoiValidator");
const experienceSchemaJOI = require("@validator/schema/experienceSchema");
const experienceSchema = require("@models/experience");
const AppError = require("@AppError");
const { default: mongoose } = require("mongoose");

exports.createExperienceEntry = async function (req, res) {
  const data = JoiValidator(experienceSchemaJOI, req.body);
  const experience = await experienceSchema.create(data);
  if (!experience) throw new AppError("failed to create data");
  return res.status(200).send({
    success: true,
    message: "Successfully create experience entry",
    data: experience,
  });
};

exports.updateExperienceEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw new AppError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  //TODO: JOI VALIDATOR IF THERE IS NO OBJECT KEYS FROM "PICK" RETURN ERROR
  const data = JoiValidator(experienceSchemaJOI, req.body, {
    pick: Object.keys(req.body),
  });
  const updatedExperience = await experienceSchema.findOneAndUpdate(
    {
      _id: id,
    },
    data,
    { new: true }
  );
  if (!updatedExperience)
    throw new AppError("Experience not found. Failed to update experience");
  return res.status(200).send({
    success: true,
    message: "Successfully update experience",
    data: updatedExperience,
  });
};

exports.getAllExperienceEntry = async function (req, res) {
  const experience = await experienceSchema.find();
  if (!experience) throw new AppError("experience are empty");
  return res.status(200).send({
    success: true,
    message: "Successfully Get All experience",
    data: experience,
  });
};

exports.getByIdExperienceEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw new AppError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  const experience = await experienceSchema.findById(id);
  if (!experience) throw new AppError("experience not found");
  return res.status(200).send({
    success: true,
    message: "Successfully Get experience",
    data: experience,
  });
};

exports.deleteExperience = async function (req, res) {
  const id = req.params.id;
  if (!id) throw new AppError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  const experience = await experienceSchema.findByIdAndDelete(id);
  if (!experience) throw new AppError("experience Not Found. Failed to Delete");
  return res.status(200).send({
    success: true,
    message: "Successfully Delete experience",
  });
};
