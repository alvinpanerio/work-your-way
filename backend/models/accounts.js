const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetExpiresOn: String,
});

module.exports = mongoose.model("Account", accountSchema);
