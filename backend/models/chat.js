const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  creator: {
    email: { type: String, required: true },
    uid: { type: String, required: true },
  },
  groupChatName: { type: String, required: true },
  groupChatID: { type: String, required: true },
  groupMembers: { type: Array, required: true },
  conversation: { type: Array },
});

module.exports = mongoose.model("Chat", chatSchema);
