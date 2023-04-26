const uniqid = require("uniqid");

const Chat = require("../models/chat");

const createGroupChat = async (req, res) => {
  let { email, uid, name, profileAvatar, groupChatName, addedFriendsToGC } =
    req.body;
  try {
    addedFriendsToGC = [
      ...addedFriendsToGC,
      [
        {
          name,
          email,
          uid,
          profileAvatar,
        },
      ],
    ];
    console.log(addedFriendsToGC);
    await Chat.create({
      creator: {
        email,
        uid,
      },
      groupChatName,
      groupChatID: uniqid.process(),
      groupMembers: addedFriendsToGC,
    });
    res.status(200).json({ reload: true });
  } catch (err) {
    console.log(err);
  }
};

const getChats = async (req, res) => {
  const { id } = req.params;

  try {
    const chats = await Chat.find({
      groupMembers: { $elemMatch: { "0.uid": "#" + id } },
    });
    res.status(200).json({ chats });
  } catch (err) {
    console.log(err);
  }
};

const checkChats = async (req, res) => {
  const { groupChatID, uid } = req.body;
  try {
    const gc = await Chat.find({
      groupChatID,
      groupMembers: { $elemMatch: { "0.uid": "#" + uid } },
    });

    console.log(gc);

    if (gc.length) {
      res.status(200).json({ gc });
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
  }
};

const sendReply = async (req, res) => {
  const { groupChatID, data } = req.body;
  try {
    data.date = new Date();
    const gc = await Chat.find({
      groupChatID,
      groupMembers: { $elemMatch: { "0.uid": data.uid } },
    });

    if (gc.length) {
      await Chat.findOneAndUpdate(
        {
          groupChatID,
        },
        {
          $push: {
            conversation: {
              data,
            },
          },
        }
      );
      res.status(200).json({ gc });
    } else {
      res.status(404).send();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createGroupChat,
  getChats,
  checkChats,
  sendReply,
};
