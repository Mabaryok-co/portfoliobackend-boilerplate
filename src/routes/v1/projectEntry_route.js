const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/projectEntry_handler");
const { errorHandlers } = require("@handler/errorHandlers");
const { bodyNotEmpty } = require("@validator/body");

privateRoute = express.Router();
publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", errorHandlers(handler.getAllProjectEntry));
publicRoute.get("/:id", errorHandlers(handler.getByIDProjectEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/new",
  bodyNotEmpty,
  errorHandlers(handler.createProjectEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  errorHandlers(handler.updateProjectEntry)
);

module.exports = router;
