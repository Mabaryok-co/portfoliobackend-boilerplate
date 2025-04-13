const mongoose = require("mongoose");

const visitorStatsSchema = mongoose.Schema({
  totalVisitor: { type: Number, default: 0 },
  totalUniqueVisitor: { type: Number, default: 0 },
});

module.exports = mongoose.model("visitorStats", visitorStatsSchema);
