const Notifications = require("../models/notifications");

const sendNotification = async (req, res) => {
  const { e, u, d } = req.body;
  try {
    if (await Notifications.findOne({ email: e })) {
      await Notifications.findOneAndUpdate(
        { uid: u },
        {
          $push: {
            notifications: d,
          },
        }
      );
    } else {
      await Notifications.create({
        uid: u,
        email: e,
        notifications: d,
      });
    }
    res.status(200).send("submitted");
  } catch (err) {
    console.log(err);
  }
};

const getNotifications = async (req, res) => {
  const { uid } = req.body;
  try {
    if (await Notifications.findOne({ uid })) {
      const userNotifs = await Notifications.findOne({ uid });
      console.log(userNotifs);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  sendNotification,
  getNotifications,
};
