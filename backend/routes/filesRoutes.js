const express = require("express");
const {
  sendFile,
  upload,
  getAccountDetails,
} = require("../controllers/filesController");

const router = express.Router();

router.get("/:id", getAccountDetails);

router.post("/", upload.single("file"), sendFile);

module.exports = router;
