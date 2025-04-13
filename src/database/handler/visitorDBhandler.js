const VisitorStatsModel = require("@models/visitorStats");
const VisitorModel = require("@models/visitor");
const { v4: uuidv4 } = require("uuid");

exports.getOrCreateVisitorStats = async () => {
  let stats = await VisitorStatsModel.findOne();
  if (!stats) {
    //Create new data if VisitorStats is none
    stats = await VisitorStatsModel.create({
      totalVisitor: 0,
      totalUniqueVisitor: 0,
    });
  }
  return stats;
};

exports.getOrCreateVisitorData = async (visitorInfo, stats) => {
  let visitor = await VisitorModel.findOne({
    ipAddr: visitorInfo.ipAddress,
  });

  if (!visitor) {
    const id = uuidv4();
    visitor = await VisitorModel.create({
      _id: id,
      ipAddr: visitorInfo.ipAddress,
      location: visitorInfo.country,
      userAgent: visitorInfo.userAgent,
      firstVisit: visitorInfo.currentTime,
      lastVisit: visitorInfo.currentTime,
    });

    //Add new unique visitor to stats and total visitor
    stats.totalVisitor += 1;
    stats.totalUniqueVisitor += 1;
  }

  return visitor;
};
