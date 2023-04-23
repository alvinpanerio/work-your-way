require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const accountRoutes = require("./routes/accountRoutes");
const filesRoutes = require("./routes/filesRoutes");
const plannerRoutes = require("./routes/plannerRoutes");

const app = express();

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.REACT_APP_MAIN_URI,
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then((err, client) => {
    server.listen(process.env.PORT, () => {
      console.log("connected to localhost:" + process.env.PORT + " and DB");
    });

    const db = mongoose.connection.db;
    const collection = db.collection("accounts");

    const changeStream = collection.watch();

    changeStream.on("change", (change) => {
      console.log(change.updateDescription.updatedFields);
      io.emit("notification", change.updateDescription.updatedFields);
    });
  })
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
app.use("/files", filesRoutes);
app.use("/planner", plannerRoutes);
