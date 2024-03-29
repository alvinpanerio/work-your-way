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
    taskDurationNum: {
      type: Number,
      required: true,
    },
    taskDuration: {
      type: Date,
      required: true,
    },
    taskDueTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const todoListDetailsSchema = new mongoose.Schema(
  {
    todoDescription: {
      type: String,
      required: true,
    },
    markDone: {
      type: Boolean,
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
  todoList: [todoListDetailsSchema],
});

module.exports = mongoose.model("Planner", plannerSchema);
