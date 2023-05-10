require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const schedule = require("node-schedule");

const accountRoutes = require("./routes/accountRoutes");
const filesRoutes = require("./routes/filesRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const leaderboardsRoutes = require("./routes/leaderboardsRoutes");

const app = express();

const http = require("http");
const leaderboards = require("./models/leaderboards");
const planner = require("./models/planner");
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
  })
  .catch((err) => {
    console.log(err);
  });

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (email) => {
    addNewUser(email, socket.id);
  });

  socket.on("addFriend", ({ addedFriend, requestor }) => {
    console.log(onlineUsers);
    const receiver = getUser(addedFriend.email);
    console.log(addedFriend, requestor);
    console.log("eto receiver", receiver);
    io.to(receiver?.socketId).emit("getAddFriendNotification", {
      requestor,
      notificationType: "addFriend",
    });
  });

  socket.on("confirmedFriend", ({ receiver, sender }) => {
    const receiverVar = getUser(receiver?.email);
    io.to(receiverVar?.socketId).emit("getConfirmedFriendNotification", {
      sender,
      notificationType: "confirmedFriend",
    });
  });

  socket.on("onlineFriends", ({ receiver }) => {
    const receiverVar = getUser(receiver);
    io.to(receiverVar?.socketId).emit("getOnlineFriends", {
      onlineUsers,
    });
  });

  socket.on("sendMessageNotif", ({ data, email, members }) => {
    onlineUsers.forEach((i) => {
      return members.forEach((j) => {
        if (i.username !== email) {
          if (j[0].email === i.username) {
            io.to(i?.socketId).emit("getMessageNotif", {
              data,
            });
          }
        }
      });
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log(onlineUsers);
    onlineUsers.forEach((i) => {
      io.to(i?.socketId).emit("getOnlineFriends", {
        onlineUsers,
      });
    });
  });
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
app.use("/notifications", notificationsRoutes);
app.use("/chat", chatRoutes);
app.use("/leaderboards", leaderboardsRoutes);

//cronjob
schedule.scheduleJob("0 0 1 * *", async () => {
  await leaderboards.deleteMany({});
  await planner.deleteMany({});
});
