const JoiValidator = require("@validator/JoiValidator");
const ProjectSchemaJOI = require("@validator/schema/projectSchema");
const ProjectSchema = require("@models/project");
const AppError = require("@AppError");
const mongoose = require("mongoose");
const { Route } = require("express");

exports.createProjectEntry = async function (req, res) {
  const data = JoiValidator(ProjectSchemaJOI, req.body);
  const project = await ProjectSchema.create(data);
  if (!project) throw new AppError("Failed to create data");
  return res.status(200).send({
    success: true,
    message: "Berhasil",
    data: project,
  });
};

exports.updateProjectEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw new AppError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  const data = JoiValidator(ProjectSchemaJOI, req.body, {
    pick: Object.keys(req.body),
  });
  const project = await ProjectSchema.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });
  if (!project) throw new AppError("Project Not Found. Failed to update");
  return res.status(200).send({
    success: true,
    message: "Berhasil",
    data: project,
  });
};

exports.getAllProjectEntry = async function (req, res) {
  const project = await ProjectSchema.find();
  return res.status(200).send({
    success: true,
    message: "Berhasil",
    data: project,
  });
};

exports.getByIDProjectEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw new AppError("ID should be in request params.");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  }
  const project = await ProjectSchema.findById(id);
  if (!project) throw new AppError("Project not found");
  return res.status(200).send({
    success: true,
    message: "Berhasil",
    data: project,
  });
};

exports.deleteProjectEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw new AppError("ID should be in request params.");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID format. Must be a valid MongoDB ObjectId");
  }
  const project = await ProjectSchema.findByIdAndDelete(id);
  console.log(project);
  return res.status(200).send({
    success: true,
    message: "Berhasil delete",
  });
};
