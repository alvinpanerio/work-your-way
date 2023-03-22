const express = require("express");
const {
  sendFile,
  upload,
  getAccountDetails,
  downloadFile,
  deleteFile,
} = require("../controllers/filesController");

const router = express.Router();

router.get("/:id", getAccountDetails);

router.post("/", upload.single("file"), sendFile);

router.get("/download/:uid/:fileName", downloadFile);

router.delete("/delete/:uid/:fileName", deleteFile);

module.exports = router;
