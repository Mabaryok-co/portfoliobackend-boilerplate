const express = require("express");
const router = express.Router();
const { upload } = require("@middleware/multerUpload");
const { verifyToken } = require("@middleware/token");
const userHandler = require("@handler/user_handler");
const { errorHandlers } = require("@handler/errorHandlers");
const { bodyNotEmpty } = require("@validator/body");
const aiHandler = require("@handler/ai_handler");

const privateRoute = express.Router();

router.use("", verifyToken, privateRoute);
privateRoute.post(
  "/completion/enhancewriting/sse",
  bodyNotEmpty,
  aiHandler.AIcompletionSSE
);
privateRoute.post(
  "/completion/enhancewriting",
  bodyNotEmpty,
  errorHandlers(aiHandler.AIcompletion)
);

module.exports = router;
