const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
  notifications: [Array],
});

module.exports = mongoose.model("Notifications", notificationsSchema);
