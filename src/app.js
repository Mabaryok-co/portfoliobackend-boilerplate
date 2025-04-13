const express = require("express");
const bparser = require("body-parser");
const config = require("@config");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const app = express();
const logger = require("@logger/logger");
const timeout = require("connect-timeout");
const { limiters } = require("@middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const cookieparser = require("cookie-parser");
const path = require("path");
const swaggerUiDist = require("swagger-ui-dist");

app.use(timeout("15s", { respond: true }));
app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());
app.use(cookieparser());
app.use(compression());
app.use(helmet());

//CORS CONFIGURATION
const mainOrigin = `${config.appUrl}:${config.port}`;
const allowedOrigins = [
  mainOrigin,
  config.cors.extraOrigins,
  config.cors.frontend,
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (config.env === "development") {
        return callback(null, true); // Allow all in dev mode
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      }

      callback(Object.assign(new Error("CORS_NOT_ALLOWED"), { status: 403 }));
    },
    credentials: true,
  })
);
app.options("*", cors());

// Apply global rate limiter to all requests
app.use(limiters.global);

// Swagger docs
app.use("/swagger-ui", express.static(swaggerUiDist.getAbsoluteFSPath()));
app.use(
  "/apidoc",
  express.static(path.join(__dirname, "../docs/swagger/swagger_config.yml"))
);
app.use(
  "/swaggerjs",
  express.static(path.join(__dirname, "../docs/swagger/swagger_script.js"))
);
app.get("/swagger", (req, res) => {
  res.sendFile(path.join(__dirname, "../docs/swagger/swagger.html"));
});

app.use(
  "public/assets",
  express.static(path.join(__dirname, "../public/assets/default_by_app"))
);
const allowedFolders = ["cv_file", "profile_image", "project_image"];
// Only serve folder that allowed. This folder includes file uploaded by user
allowedFolders.forEach((folder) => {
  app.use(
    `/public/document/${folder}`,
    express.static(
      path.join(__dirname, "../public/assets/upload_by_user", folder)
    )
  );
});

//Entry Point Semua Route
const route = require("./routes/route");
app.use("", route);

//Handle if there is unknown route
app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: `Route not found`,
  });
});

app.use(errorHandler);

module.exports = app;
