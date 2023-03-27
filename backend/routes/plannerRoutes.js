const express = require("express");

const { getAccountDetails } = require("../controllers/plannerController");

const router = express.Router();

router.get("/:id", getAccountDetails);

module.exports = router;
