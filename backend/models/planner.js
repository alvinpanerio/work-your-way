const mongoose = require("mongoose");

const plannerListDetailsSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
    },
    taskDescription: {
      type: String,
      required: true,
    },
    taskDuration: {
      type: String,
      required: true,
    },
    taskDueTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const plannerSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  plannerList: [plannerListDetailsSchema],
});

module.exports = mongoose.model("Planner", plannerSchema);
