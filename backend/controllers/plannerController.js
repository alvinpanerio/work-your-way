require("dotenv").config();
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

module.exports = {
  getAccountDetails,
};
