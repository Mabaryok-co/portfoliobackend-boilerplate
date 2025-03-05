const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/experienceEntry_handler");
const { errorHandlers } = require("@handler/errorHandlers");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", errorHandlers(handler.getAllExperienceEntry));
publicRoute.get("/:id", errorHandlers(handler.getByIdExperienceEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/create",
  bodyNotEmpty,
  errorHandlers(handler.createExperienceEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  errorHandlers(handler.updateExperienceEntry)
);
privateRoute.delete("/delete/:id", errorHandlers(handler.deleteExperience));

module.exports = router;
