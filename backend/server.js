require("dotenv").config();

const express = require("express");

const app = express();

app.listen(process.env.PORT, () => {
  console.log("connected to localhost:" + process.env.PORT);
});

//middleware

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

//routes

app.get("/", (req, res) => {
  res.send("welcome");
});
