const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: Object, required: true },
    technology: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("project", ProjectSchema);
