const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/certificateEntry_handler");
const { errorHandlers } = require("@handler/errorHandlers");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", errorHandlers(handler.getAllCertificateEntry));
publicRoute.get("/:id", errorHandlers(handler.getByIdCertificateEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/create",
  bodyNotEmpty,
  errorHandlers(handler.createCertificateEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  errorHandlers(handler.updateCertificateEntry)
);
privateRoute.delete("/delete/:id", errorHandlers(handler.deleteCertificate));

module.exports = router;
