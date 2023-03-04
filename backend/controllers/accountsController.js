const Account = require("../models/accounts");

const getLogin = (req, res) => {
  res.send("login");
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    await Account.create({
      email,
      password,
    });
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

const getForgotPassword = (req, res) => {
  res.send("forgot password");
};

module.exports = { getLogin, signup, getForgotPassword };
