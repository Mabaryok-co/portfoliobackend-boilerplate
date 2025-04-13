const reqIp = require("request-ip");
const { lookup } = require("ip-location-api");
const VisitorDBhandler = require("@DBhandler/visitorDBhandler");

async function extractVisitorInfo(req) {
  const ipAddress = reqIp.getClientIp(req);
  const ipLocation = await lookup(ipAddress);
  const country = ipLocation ? ipLocation.country : "unknown";
  const currentTime = new Date();
  const userAgent = req.headers["user-agent"] || "unknown";
  return {
    ipAddress,
    userAgent,
    currentTime,
    country,
  };
}
exports.visitorTrackerEndpoint = async function (req, res) {
  const stats = await VisitorDBhandler.getOrCreateVisitorStats();
  const visitorInfo = await extractVisitorInfo(req);
  const visitorDataFromDB = await VisitorDBhandler.getOrCreateVisitorData(
    visitorInfo,
    stats
  );

  const timeSinceLastVisit =
    visitorInfo.currentTime - visitorDataFromDB.lastVisit;

  //30 Minutes time limiter to add new visit activity
  const time_limiter = 30 * 60 * 1000;

  if (timeSinceLastVisit > time_limiter) {
    //Add +1 visitor if time since last visit is greater than time limiter
    stats.totalVisitor += 1;
  }

  visitorDataFromDB.lastVisit = visitorInfo.currentTime;
  visitorDataFromDB.save();
  stats.save();

  return res.status(200).send({
    success: true,
    message: "Successfully added visitor",
  });
};
