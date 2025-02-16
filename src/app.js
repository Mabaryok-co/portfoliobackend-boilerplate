const express = require("express");
const bparser = require("body-parser");
const config = require("../config/config");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const app = express();
const logger = require("../library/logger/logger");

app.use(bparser.urlencoded({ extended: true }));
app.use(bparser.json());
app.use(helmet());

//Gzip compression
app.use(compression());

//CORS CONFIGURATION
const allowedOrigins = config.cors.allowedOrigins.split(",");
app.use(
  cors({
    origin: function (origin, callback) {
      if (config.env === "development") {
        return callback(null, true); // Allow all in dev mode
      }
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      }

      logger.warn(`CORS ditolak untuk origin: ${origin}`);

      callback(new Error("Akses CORS tidak diizinkan"));
    },
    credentials: true,
  })
);
app.options("*", cors());

/**
 * @route Entry Point Semua Route
 */
const route = require("./routes/route");
app.use("", route);

//Handle if there is unknown route
app.use((req, res) => {
  res.status(404).send({
    status: false,
    message: `Route not found`,
  });
});

module.exports = app;
