const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/experienceEntry_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", tryCatch(handler.getAllExperienceEntry));
publicRoute.get("/:id", tryCatch(handler.getByIdExperienceEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/create",
  bodyNotEmpty,
  tryCatch(handler.createExperienceEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  tryCatch(handler.updateExperienceEntry)
);
privateRoute.delete("/delete/:id", tryCatch(handler.deleteExperience));

module.exports = router;
