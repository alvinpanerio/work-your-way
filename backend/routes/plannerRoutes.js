const express = require("express");

const {
  getAccountDetails,
  submitTask,
} = require("../controllers/plannerController");

const router = express.Router();

router.get("/:id", getAccountDetails);
router.post("/", submitTask);

module.exports = router;
