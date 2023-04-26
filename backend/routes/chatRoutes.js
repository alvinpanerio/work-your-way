const express = require("express");

const {
  createGroupChat,
  getChats,
  checkChats,
  sendReply,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/create-gc", createGroupChat);
router.get("/get-chats/:id", getChats);
router.post("/check-gc", checkChats);
router.post("/send-reply", sendReply);

module.exports = router;
