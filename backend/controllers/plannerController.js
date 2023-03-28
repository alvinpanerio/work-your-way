require("dotenv").config();
const Files = require("../models/files");
const Account = require("../models/accounts");
const Planner = require("../models/planner");

const getAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    await Promise.all([
      Account.findOne({ email: id }),
      Planner.findOne({ email: id }),
    ])
      .then((results) => {
        const combinedData = {
          accountDetails: results[0],
          plannerDetails: results[1],
        };
        res.json(combinedData);
      })
      .catch((error) => {
        res.status(404).json({ redirect: "/error" });
      });
  } catch (error) {
    console.log(error);
  }
};

const submitTask = async (req, res) => {
  const {
    uid,
    email,
    taskName,
    taskDesc,
    taskDurationNum,
    taskDuration,
    taskTime,
  } = req.body;
  try {
    let duration = 0;

    if (taskDuration === "day") {
      duration = 1;
    } else if (taskDuration === "week") {
      duration = 7;
    } else if (taskDuration === "month") {
      duration = 30;
    }
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + duration);
    if (await Planner.findOne({ uid })) {
      await Planner.findOneAndUpdate({
        uid,
        email,
        $push: {
          plannerList: {
            taskName,
            taskDescription: taskDesc,
            taskDurationNum: duration,
            taskDuration: dueDate,
            taskDueTime: taskTime,
          },
        },
      });
    } else {
      await Planner.create({
        uid,
        email,
        plannerList: {
          taskName,
          taskDescription: taskDesc,
          taskDurationNum: duration,
          taskDuration: dueDate,
          taskDueTime: taskTime,
        },
      });
    }
    res.status(200).send("submitted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAccountDetails,
  submitTask,
};
