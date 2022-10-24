const express = require("express");

const user = require("./routes/user.routes");
const app = express();

app.use(express.json());

app.use("/api/v1/users", user);

module.exports = app;
