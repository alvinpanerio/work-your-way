const express = require("express");

const {
  sendNotification,
  getNotifications,
} = require("../controllers/notificationsController");

const router = express.Router();

router.post("/send-notification", sendNotification);
router.get("/get-notifications/:id", getNotifications);

module.exports = router;
