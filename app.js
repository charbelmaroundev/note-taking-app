const express = require("express");
const morgan = require("morgan");

const user = require("./routes/user.routes");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use("/api/v1/users", user);

module.exports = app;
