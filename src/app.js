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

app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());
app.use(helmet());
app.use(compression());

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
app.use(timeout("15s", { respond: true }));

// Apply global rate limiter to all requests
app.use(limiters.global);

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
