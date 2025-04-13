const express = require("express");
const router = express.Router();
const { verifyToken } = require("@middleware/token");
const handler = require("@handler/certificateEntry_handler");
const tryCatch = require("@tryCatch");
const { bodyNotEmpty } = require("@validator/body");

const privateRoute = express.Router();
const publicRoute = express.Router();

router.use("", publicRoute);
publicRoute.get("/all", tryCatch(handler.getAllCertificateEntry));
publicRoute.get("/:id", tryCatch(handler.getByIdCertificateEntry));

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/create",
  bodyNotEmpty,
  tryCatch(handler.createCertificateEntry)
);
privateRoute.put(
  "/update/:id",
  bodyNotEmpty,
  tryCatch(handler.updateCertificateEntry)
);
privateRoute.delete("/delete/:id", tryCatch(handler.deleteCertificate));

module.exports = router;
