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
app.use(cors());
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
