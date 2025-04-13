const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const visitorSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4(), required: true },
  ipAddr: { type: String, required: true },
  location: { type: String, default: "unknown", required: true },
  userAgent: { type: String, required: true },
  firstVisit: { type: Date, required: true },
  lastVisit: { type: Date, required: true },
});

module.exports = mongoose.model("visitor", visitorSchema);
