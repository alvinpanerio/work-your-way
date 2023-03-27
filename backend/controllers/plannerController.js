require("dotenv").config();
const Files = require("../models/files");
const Account = require("../models/accounts");
const Planner = require("../models/planner");

const getAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    await Promise.all([
      Account.findOne({ email: id }),
      Files.findOne({ email: id }),
    ])
      .then((results) => {
        const combinedData = {
          accountDetails: results[0],
          fileDetails: results[1],
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
  const { uid, email, taskName, taskDesc, taskDuration, taskTime } = req.body;
  try {
    if (await Planner.findOne({ uid })) {
      await Planner.findOneAndUpdate({
        uid,
        email,
        $push: {
          plannerList: {
            taskName,
            taskDescription: taskDesc,
            taskDuration,
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
          taskDuration,
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
