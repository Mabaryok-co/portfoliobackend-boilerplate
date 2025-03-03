const mongoose = require("mongoose");

const SertificateSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    year: {
      type: Number,
      min: [1950, "Year Date must be greater than 1950"],
      required: true,
    },
  },
  { timestamps: true }
);
