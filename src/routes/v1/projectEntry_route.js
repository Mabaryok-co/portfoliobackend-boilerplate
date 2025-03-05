const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/projectEntry_handler");
const { errorHandlers } = require("@handler/errorHandlers");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", errorHandlers(handler.getAllProjectEntry));
publicRoute.get("/:id", errorHandlers(handler.getByIDProjectEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/create",
  bodyNotEmpty,
  errorHandlers(handler.createProjectEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  errorHandlers(handler.updateProjectEntry)
);
privateRoute.delete("/delete/:id", errorHandlers(handler.deleteProjectEntry));

module.exports = router;
