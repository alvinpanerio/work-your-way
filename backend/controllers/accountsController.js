require("dotenv").config();
const emailExistence = require("email-existence");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Account = require("../models/accounts");

const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKEN, { expiresIn: "1d" });
};

const makeTransport = nodemailer.createTransport({
  service: "Zoho",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

const login = async (req, res) => {
  const { email, password } = req.body;
  let id = null;
  try {
    await Account.findOne({ email }).then((result) => {
      if (!result) {
        res.status(404).json({ error: "Uknown email!" });
      } else {
        id = result._id;
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
  const { email, password, profileDetails } = req.body;
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
                      profileDetails,
                    });
                    // email the account
                    let successfulMessage = {
                      from: "codetalker@zohomail.com",
                      to: `${email}`,
                      subject:
                        "Personal Workspace Account Creation Confirmation",
                      text: `We are pleased to inform you that your account: ${email} has been successfully created on our platform. We appreciate your decision to join our community and look forward to serving you.`,
                    };

                    makeTransport.sendMail(successfulMessage, (err, data) => {
                      err
                        ? console.log("Email error" + err)
                        : console.log("Email sent successfully");
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

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Account.findOne({ email });
    await Account.findOne({ email }).then((result) => {
      if (!result) {
        res.status(404).json({ error: "Email is not registered!" });
      } else {
        const token = crypto.randomBytes(32).toString("hex");
        // setting key/value pairs in db
        user.resetToken = token;
        user.resetExpiresOn = Date.now() + 900000;
        user.save();
        let successfulMessage = {
          from: "codetalker@zohomail.com",
          to: `${email}`,
          subject: "Personal Workspace Account Password Reset",
          text: `http://localhost:3000/forgot/${token}`,
        };

        makeTransport.sendMail(successfulMessage, (err, data) => {
          err
            ? console.log("Email error" + err)
            : console.log("Email sent successfully");
        });
        console.log(user);
        res.send("Registered email");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getPasswordReset = async (req, res) => {
  const { resetToken } = req.params;
  try {
    await Account.findOne({ resetToken, resetExpiresOn: { $gt: Date.now() } })
      .then((result) => {
        if (result) {
          res.send("asdasd");
        } else {
          res.status(404).json({ redirect: "/error" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

const passwordReset = async (req, res) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const user = await Account.findOne({ resetToken });
  try {
    await Account.findOne({
      resetToken,
      resetExpiresOn: { $gt: Date.now() },
    }).then((result) => {
      if (password.length > 7) {
        bcrypt.genSalt(10).then((result) => {
          bcrypt.hash(password, result).then((result) => {
            user.password = result;
            user.resetToken = undefined;
            user.resetExpiresOn = undefined;
            user.save();
            res.send("Reset Successful");
          });
        });
      } else {
        res.status(404).json({ redirect: "/error" });
      }
    });
  } catch (err) {
    console.log(error);
  }
};

module.exports = {
  login,
  signup,
  forgotPassword,
  passwordReset,
  getPasswordReset,
};
