require("dotenv").config();
const multer = require("multer");
const fs = require("fs");
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
  destination: function (req, file, cb) {
    cb(null, process.env.FILE_STORAGE_PATH);
  },
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
        fileName,
        fileSize: `${byteSize(fileSize).value} ${byteSize(fileSize).unit}`,
      },
    });
  }
  console.log("sent");
  res.status(200).send({ msf: "Dd" });
};

const downloadFile = async (req, res) => {
  const { uid, fileName } = req.params;
  try {
    console.log(uid, fileName);
    const user = await Files.findOne({ uid: `#${uid}` });
    const path = await user.files.forEach((i) => {
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + i.file.filename
      );
      const fileStream = fs.createReadStream(i.file.path);
      return i.file.filename === fileName
        ? // ? res.download(`./${i.file.path}`)
          fileStream.pipe(res)
        : null;
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteFile = async (req, res) => {
  const { uid, fileName } = req.params;
  try {
    console.log(uid, fileName);
    const user = await Files.findOne({ uid: `#${uid}` });

    const file = await Files.findByIdAndUpdate(user._id, {
      file: { filename: fileName },
    });

    let fileId = "";

    file.files.forEach((i) => {
      i.file.filename === fileName ? (fileId = i._id) : null;
    });

    await Files.findOneAndUpdate({
      $pull: {
        files: {
          _id: fileId,
        },
      },
    });

    fs.unlink("files/" + fileName, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    res.send("The file has been deleted successfully.");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendFile,
  getAccountDetails,
  upload,
  downloadFile,
  deleteFile,
};
