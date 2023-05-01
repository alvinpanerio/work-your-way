const mongoose = require("mongoose");

const leaderboardsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  taskNum: {
    type: Number,
    required: true,
  },
  profileAvatar: {
    type: String,
    required: true,
  },
  border: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Leaderboards", leaderboardsSchema);
