const express = require("express");
const router = express.Router();
const handler = require("@handler/visitor_handler");
const tryCatch = require("@tryCatch");

const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.post("", tryCatch(handler.visitorTrackerEndpoint));

module.exports = router;
