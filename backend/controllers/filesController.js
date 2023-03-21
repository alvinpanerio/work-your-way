require("dotenv").config();
const multer = require("multer");
const Files = require("../models/files");
const Account = require("../models/accounts");

const getAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Account.findOne({ _id: id })
      .then((result) => {
        res.status(200).json({
          uid: result.profileDetails[0].uid,
          email: result.email,
        });
      })
      .catch((error) => {
        res.status(404).json({ redirect: "/error" });
      });
  } catch (error) {
    console.log(error);
  }
};

//multer
const storage = multer.diskStorage({
  destination: "./files/",
  filename: function (req, file, cb) {
    cb(null, "file-" + Date.now());
  },
});

let upload = multer({ storage });

const sendFile = async (req, res) => {
  const { fileName, fileSize, uid, email } = req.body;
  console.log(req.file);
  await Files.findOneAndUpdate({
    uid,
    email,
    $push: { files: { file: req.file, fileName, fileSize } },
  });
  console.log("sent");
  res.status(200).send({ msf: "Dd" });
};

module.exports = {
  sendFile,
  getAccountDetails,
  upload,
};
