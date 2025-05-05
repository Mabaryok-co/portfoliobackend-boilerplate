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
const morgan = require("morgan");

app.set("trust proxy", true);

app.use(timeout("15s", { respond: true }));
app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());
app.use(cookieparser());
app.use(compression());
app.use(helmet());

app.get("/", function (_, res) {
  res.status(200).send("You found me!");
});

app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

//CORS CONFIGURATION
const allowedOrigins = [
  config.cors.extraOrigins,
  config.cors.frontend,
  config.appUrl,
  `${config.appUrl}:${config.port}`,
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// app.use((req, _, next) => {
//   console.log("\n[REQ] Method:", req.method);
//   console.log("[REQ] URL:", req.url);
//   console.log("[REQ] Origin:", req.headers.origin);
//   console.log("[REQ] User-Agent:", req.headers["user-agent"]);
//   next();
// });

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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

// Only serve folder that allowed. This folder includes file uploaded by user
const allowedFolders = ["cv_file", "profile_image", "thumbnail_image"];
allowedFolders.forEach((folder) => {
  app.use(
    `/document/${folder}`,
    express.static(
      path.join(__dirname, "../public/assets/upload_by_user", folder),
      {
        setHeaders: (res, _) => {
          //Allow from anywhere if development
          if (config.env == "development") {
            res.set("Access-Control-Allow-Origin", "*");
          } else {
            const origin = res.req.headers.origin;
            if (allowedOrigins.includes(origin)) {
              res.set("Access-Control-Allow-Origin", origin);
            }
          }
          res.set("Cross-Origin-Resource-Policy", "cross-origin");
        },
      }
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
