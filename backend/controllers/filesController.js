require("dotenv").config();
const multer = require("multer");
const byteSize = require("byte-size");
const Files = require("../models/files");
const Account = require("../models/accounts");

const getAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    await Promise.all([
      Account.findOne({ email: id }),
      Files.findOne({ email: id }),
    ])
      .then((results) => {
        const combinedData = {
          accountDetails: results[0],
          fileDetails: results[1],
        };
        res.json(combinedData);
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
  if (await Files.findOne({ uid })) {
    await Files.findOneAndUpdate({
      uid,
      email,
      $push: {
        files: {
          file: req.file,
          fileName,
          fileSize: `${byteSize(fileSize).value} ${byteSize(fileSize).unit}`,
        },
      },
    });
  } else {
    await Files.create({
      uid,
      email,
      files: {
        file: req.file,
        fileSize: `${byteSize(fileSize).value} ${byteSize(fileSize).unit}`,
        fileSize,
      },
    });
  }
  console.log("sent");
  res.status(200).send({ msf: "Dd" });
};

module.exports = {
  sendFile,
  getAccountDetails,
  upload,
};
