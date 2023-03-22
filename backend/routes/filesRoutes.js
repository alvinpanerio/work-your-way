const express = require("express");
const {
  sendFile,
  upload,
  getAccountDetails,
  downloadFile,
} = require("../controllers/filesController");

const router = express.Router();

router.get("/:id", getAccountDetails);

router.post("/", upload.single("file"), sendFile);

router.get("/download/:uid/:fileName", downloadFile);

module.exports = router;
