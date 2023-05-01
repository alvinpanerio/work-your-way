const Leaderboards = require("../models/leaderboards");

const updatePoints = async (req, res) => {
  const { email, uid, points, taskNum, pic, name } = req.body;
  const { id } = req.params;
  try {
    if (await Leaderboards.findOne({ email: id })) {
      await Leaderboards.findOneAndUpdate(
        { uid },
        {
          points,
          taskNum,
        }
      );
    } else {
      await Leaderboards.create({
        email,
        uid,
        name,
        points,
        taskNum,
        profileAvatar: pic,
      });
    }
    res.send("submitted");
  } catch (err) {
    console.log(err);
  }
};

const getLeaderboards = async (req, res) => {
  try {
    const leaderboards = await Leaderboards.find();
    res.json({ leaderboards });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  updatePoints,
  getLeaderboards,
};
