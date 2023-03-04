const Account = require("../models/accounts");

const getLogin = (req, res) => {
  res.send("login");
};

const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    await Account.create({
      username,
      password,
    });
    res.send("signup successful");
  } catch (err) {
    console.log(err);
  }
};

const getForgotPassword = (req, res) => {
  res.send("forgot password");
};

module.exports = { getLogin, signup, getForgotPassword };
