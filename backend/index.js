require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const accountRoutes = require("./routes/accountRoutes");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(
    app.listen(process.env.PORT, () => {
      console.log("connected to localhost:" + process.env.PORT + " and DB");
    })
  )
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

//routes

app.use("/", accountRoutes);
