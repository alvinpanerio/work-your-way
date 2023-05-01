const express = require("express");
const {
  updatePoints,
  getLeaderboards,
} = require("../controllers/leaderboardsController");

const router = express.Router();

router.post("/update-points/:id", updatePoints);
router.get("/get-leaderboards", getLeaderboards);

module.exports = router;
