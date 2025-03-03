const JoiValidator = require("@validator/JoiValidator");
const CertificateSchemaJOI = require("@validator/schema/certificateSchema");
const CertificateSchema = require("@models/certificate");
const { RouteError } = require("./errorHandlers");
const { default: mongoose } = require("mongoose");

exports.createCertificateEntry = async function (req, res) {
  const data = JoiValidator(CertificateSchemaJOI, req.body);
  const certificate = await CertificateSchema.create(data);
  if (!certificate) throw RouteError("failed to create data");
  return res.status(200).send({
    success: true,
    message: "Successfully create certificate entry",
    data: certificate,
  });
};

exports.updateCertificateEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw RouteError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw RouteError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  //TODO: JOI VALIDATOR IF THERE IS NO OBJECT KEYS FROM "PICK" RETURN ERROR
  const data = JoiValidator(CertificateSchemaJOI, req.body, {
    pick: Object.keys(req.body),
  });
  const updatedCertificate = await CertificateSchema.findOneAndUpdate(
    {
      _id: id,
    },
    data,
    { new: true }
  );
  if (!updatedCertificate) throw RouteError("Failed to update certificate");
  return res.status(200).send({
    success: true,
    message: "Successfully update certificate",
    data: updatedCertificate,
  });
};

exports.getAllCertificateEntry = async function (req, res) {
  const certificate = await CertificateSchema.find();
  if (!certificate) throw RouteError("Certificate are empty");
  return res.status(200).send({
    success: true,
    message: "Successfully Get All Certificate",
    data: certificate,
  });
};

exports.getByIdCertificateEntry = async function (req, res) {
  const id = req.params.id;
  if (!id) throw RouteError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw RouteError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  const certificate = await CertificateSchema.findById(id);
  if (!certificate) throw RouteError("Certificate not found");
  return res.status(200).send({
    success: true,
    message: "Successfully Get Certificate",
    data: certificate,
  });
};

exports.deleteCertificate = async function (req, res) {
  const id = req.params.id;
  if (!id) throw RouteError("ID should be in request params");
  if (!mongoose.Types.ObjectId.isValid(id))
    throw RouteError("Invalid ID format. Must be a valid MongoDB ObjectId.");
  const certificate = await CertificateSchema.findByIdAndDelete(id);
  if (!certificate) throw RouteError("Certificate Not Found. Failed to Delete");
  return res.status(200).send({
    success: true,
    message: "Successfully Delete Certificate",
  });
};
