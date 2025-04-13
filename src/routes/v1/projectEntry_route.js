const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/projectEntry_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", tryCatch(handler.getAllProjectEntry));
publicRoute.get("/:id", tryCatch(handler.getByIDProjectEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/create",
  bodyNotEmpty,
  tryCatch(handler.createProjectEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  tryCatch(handler.updateProjectEntry)
);
privateRoute.delete("/delete/:id", tryCatch(handler.deleteProjectEntry));

module.exports = router;
