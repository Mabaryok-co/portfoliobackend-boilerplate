const express = require("express");
const connectDB = require("./database/db_connection");
const bparser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const { checkRedis } = require("./database/redis_connection");

dotenv.config();

app.use(bparser.urlencoded());
app.use(bparser.json());

/**
 * @route Entry Point Semua Route
 */
const route = require("./routes/route");
app.use("", route);

async function startServer() {
  await checkRedis();
  await connectDB();
  app.listen(process.env.PORT, process.env.HOST, async () => {
    console.log(
      `Server Berjalan Pada http://${process.env.HOST}:${process.env.PORT}`
    );
  });
}

startServer();
