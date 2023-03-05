require("dotenv").config();
const emailExistence = require("email-existence");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Account = require("../models/accounts");

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN, { expiresIn: "1d" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  let id = null;
  try {
    await Account.exists({ email }).then((result) => {
      id = result._id;
      if (!result) {
        res.status(404).json({ error: "Uknown email!" });
      } else {
        Account.findById(result).then((result) => {
          bcrypt.compare(password, result.password, (error, result) => {
            if (error) {
              console.log(error);
            }

            if (result) {
              const token = generateToken(id);
              res.status(200).json({ email, token });
            } else {
              res
                .status(404)
                .json({ error: "Incorrect username and password!" });
            }
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

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
      res.status(404).json({ error: "Sign up error!" });
      throw new Error();
    }
  } catch (err) {
    console.log(err);
  }
};

const getForgotPassword = (req, res) => {
  res.send("forgot password");
};

module.exports = { login, signup, getForgotPassword };
