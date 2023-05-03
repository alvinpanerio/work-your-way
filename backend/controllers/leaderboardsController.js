const Leaderboards = require("../models/leaderboards");
const Accounts = require("../models/accounts");

const updatePoints = async (req, res) => {
  const { email, uid, points, taskNum, pic, name } = req.body;
  const { id } = req.params;
  let border = "";
  try {
    if (await Leaderboards.findOne({ email: id })) {
      if (points >= 10 && points <= 29) {
        border = "/static/media/1.f38065ce808b08cfd975.png";
      } else if (points >= 30 && points <= 49) {
        border = "/static/media/2.a6fa5c013b4d4696371b.png";
      } else if (points >= 50 && points <= 99) {
        border = "/static/media/3.f4dd903352e054fef783.png";
      } else if (points >= 100 && points <= 199) {
        border = "/static/media/4.2766985d7582884df086.png";
      } else if (points >= 200) {
        border = "/static/media/5.1014ee119b1b97be368f.png";
      }
      await Leaderboards.findOneAndUpdate(
        { uid },
        {
          name,
          points,
          taskNum,
          profileAvatar: pic,
          border,
        }
      );
      await Accounts.findOneAndUpdate(
        { "profileDetails.0.uid": uid },
        {
          $set: {
            "profileDetails.0.border": border,
          },
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
        border,
      });
      await Accounts.findOneAndUpdate(
        { "profileDetails.0.uid": uid },
        {
          $set: {
            "profileDetails.0.border": border,
          },
        }
      );
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
