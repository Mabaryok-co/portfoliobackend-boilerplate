//TODO: Create get project endpoint

const JoiValidator = require("@validator/JoiValidator");
const ProjectSchema = require("@validator/schema/projectSchema");

//TODO: Create entry endpoint
exports.createProjectEntry = async function (req, res) {
  const data = JoiValidator(ProjectSchema, req.body);
  console.log(data);
  return res.status(200).send({
    success: true,
    message: "Berhasil",
    data: data,
  });
};
