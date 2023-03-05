const emailExistence = require("email-existence");
const bcrypt = require("bcrypt");
const Account = require("../models/accounts");

const getLogin = (req, res) => {
  res.send("login");
};

async function generateSalt(num) {
  return await bcrypt.genSalt(num);
}

async function hashPassword(em, sa) {
  return await bcrypt.hash(em, sa);
}

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password.length > 7) {
      await Account.countDocuments({ email: email })
        .then((docs) => {
          console.log(docs);
          if (docs > 0) {
            res.status(404).json({ error: "Email is already registered!" });
          } else {
            emailExistence.check(email, function (error, response) {
              if (response) {
                // encrypting the password
                bcrypt.genSalt(10).then((result) => {
                  bcrypt.hash(password, result).then((result) => {
                    // pushing to the database
                    Account.create({
                      email,
                      password: result,
                    });
                    res.send("succesful");
                  });
                });
              } else {
                res.status(404).json({ error: "Enter a valid email!" });
              }
            });
          }
        })
        .catch((err) => console.log(err));
    } else {
      throw new Error();
    }
  } catch (err) {
    console.log(err);
  }
};

const getForgotPassword = (req, res) => {
  res.send("forgot password");
};

module.exports = { getLogin, signup, getForgotPassword };
