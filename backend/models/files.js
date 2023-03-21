const mongoose = require("mongoose");

const fileDetailsSchema = new mongoose.Schema(
  {
    file: {
      type: Object,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const filesSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  files: [fileDetailsSchema],
});

module.exports = mongoose.model("Files", filesSchema);
