const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: Object, required: true },
    technology: { type: String, required: true },
    project_thumbnail_image: {
      type: String,
      required: true,
      default: "https://placehold.co/1920x1080",
    },
    year: { type: String, required: true }, // String harus sudah sesuai format "YYYY-MM"
    link: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("project", ProjectSchema);
