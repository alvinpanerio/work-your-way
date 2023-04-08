const mongoose = require("mongoose");

const profileDetailsSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileAvatar: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: false,
    default: "n/a",
  },
  address: {
    type: String,
    required: false,
    default: "n/a",
  },
  contactNo: {
    type: Number,
    required: false,
    default: 0,
  },
  bday: {
    type: String,
    required: false,
    default: "n/a",
  },
  status: {
    type: String,
    required: false,
    default: "n/a",
  },
  bio: {
    type: String,
    required: false,
    default: "n/a",
  },
});

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileDetails: [profileDetailsSchema],
  resetToken: String,
  resetExpiresOn: String,
});

module.exports = mongoose.model("Account", accountSchema);
