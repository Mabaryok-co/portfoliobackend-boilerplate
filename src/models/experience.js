const mongoose = require("mongoose");

const ExperienceSchema = mongoose.Schema(
  {
    entity: { type: String, required: true },
    position: { type: String, required: true },
    type: { type: String, enum: ["organizational", "job"], required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ExperienceSchema", ExperienceSchema);
