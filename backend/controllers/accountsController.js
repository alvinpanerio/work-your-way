require("dotenv").config();
const emailExistence = require("email-existence");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const uniqid = require("uniqid");
const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require("unique-names-generator");
const Account = require("../models/accounts");
const Files = require("../models/files");
const Planner = require("../models/planner");
const { findOne } = require("../models/accounts");
const { constants } = require("http2");
const emailValidation = require("nodejs-email-validation");
var validator = require("email-validator");
const EmailValidator = require("email-deep-validator");
var nev = require("node-email-validator");
var kickbox = require("kickbox")
  .client(
    "live_465a5c0c6125f0e7e30be7ac5eee54af3604ffaa607b901b93df747f6149a434"
  )
  .kickbox();

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
              res.status(200).json({ email, token, id });
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
            kickbox.verify(email, function (err, response) {
              console.log(response.body);
              if (response.body.result === "deliverable") {
                // encrypting the password
                bcrypt.genSalt(10).then((result) => {
                  bcrypt.hash(password, result).then((result) => {
                    // pushing to the database
                    Account.create({
                      email,
                      password: result,
                      profileDetails: {
                        uid: "#" + uniqid.process(),
                        name: uniqueNamesGenerator({
                          dictionaries: [adjectives, animals],
                          separator: " ",
                        }).slice(0, 16),
                        profileAvatar: profileDetails.profileAvatar,
                      },
                    });
                    // email the account
                    let successfulMessage = {
                      from: "codetalker@zohomail.com",
                      to: `${email}`,
                      subject:
                        "Personal Workspace Account Creation Confirmation",
                      text: `Dear ${email},
                      
We are pleased to inform you that your registration to our website has been successful. You can now access all the features and services that our website offers.
                      
Thank you for choosing our website as your online destination. We are committed to providing you with the best user experience possible. Please do not hesitate to contact us if you have any questions or concerns.
                      
Once again, thank you for registering with us. We look forward to having you as a valued member of our community.
              
Best regards,
Codetalker`,
                    };
                    makeTransport.sendMail(successfulMessage, (err, data) => {
                      err
                        ? res.send("error" + JSON.stringify(err))
                        : res.send("succesful");
                    });
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
          text: `Dear ${email},

It seems that you have forgotten your password to access your account on our website. Not to worry, we are here to help you reset your password and regain access to your account.

Please click on the link http://${process.env.REACT_APP_MAIN_URI}/forgot/${token} within the next 15 minutes to reset your password. If you do not reset your password within this time frame, the link will expire, and you will need to request a new one.

Please note that for security reasons, we cannot retrieve it for you. You will need to follow the password reset process to create a new password.

If you did not request a password reset, please disregard this email and contact us immediately to report any unauthorized activity on your account.

Thank you for your cooperation.

Best regards,
CodeTalker`,
        };

        makeTransport.sendMail(successfulMessage, (err, data) => {
          err ? res.send("error" + JSON.stringify(err)) : res.send("succesful");
        });
        console.log(user);
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
  } catch (error) {
    console.log(error);
  }
};

const getAccountDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Account.findOne({ _id: id })
      .then((result) => {
        res.status(200).json({
          uid: result.profileDetails[0].uid,
          name: result.profileDetails[0].name,
          avatar: result.profileDetails[0].profileAvatar,
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

const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { name, image, course, address, contactNo, bday, status, bio } =
    req.body;
  try {
    if (await Account.findOne({ _id: id })) {
      await Account.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            "profileDetails.0.name": name,
            "profileDetails.0.profileAvatar": image,
            "profileDetails.0.course": course,
            "profileDetails.0.address": address,
            "profileDetails.0.contactNo": contactNo,
            "profileDetails.0.bday": bday,
            "profileDetails.0.status": status,
            "profileDetails.0.bio": bio,
          },
        }
      );
    } else {
      return res.status(404).send("failed");
    }
    res.status(200).send("submitted");
  } catch (error) {
    console.log(error);
  }
};

const deleteAccount = async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    const user = await Account.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(404).json({ errorMessage: "Password Incorrect!" });
      return;
    }

    if (await Account.findOne({ email })) {
      await Account.deleteOne({ email });
      await Files.deleteOne({ email });
      await Planner.deleteOne({ email });
    } else {
      res.status(404).send("failed");
    }
    res.status(200).send("deleted");
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    await Account.find({}).then((result) => {
      res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
};

const addFriendUser = async (req, res) => {
  const { uid } = req.params;
  const { email, uidRequestor } = req.body;
  try {
    if (
      (await Account.findOne({ "profileDetails.0.uid": "#" + uid })) &&
      uid !== uidRequestor.slice(1, 12)
    ) {
      //added friend
      const addedFriend = await Account.findOneAndUpdate(
        {
          "profileDetails.0.uid": "#" + uid,
        },
        {
          $push: {
            friends: {
              email,
              uid: uidRequestor,
              isConfirmedFriend: 1,
              isRequestorMe: false,
            },
          },
        }
      );
      //requestor
      await Account.findOneAndUpdate(
        {
          "profileDetails.0.uid": uidRequestor,
        },
        {
          $push: {
            friends: {
              email: addedFriend.email,
              uid: "#" + uid,
              isConfirmedFriend: 1,
              isRequestorMe: true,
            },
          },
        }
      );
      res.status(200).json({ reload: true });
    } else {
      res.status(404).send("User not Found!");
    }
  } catch (error) {
    console.log(error);
  }
};

const visitUser = async (req, res) => {
  const { uid } = req.params;
  try {
    if (await Account.findOne({ "profileDetails.0.uid": "#" + uid })) {
      res.status(200).send("found");
    } else {
      res.status(404).send("User not Found!");
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  const { uid } = req.params;
  try {
    if (await Account.findOne({ "profileDetails.0.uid": "#" + uid })) {
      await Account.findOne({ "profileDetails.0.uid": "#" + uid }).then(
        (result) => {
          res.status(200).json({ result });
        }
      );
    } else {
      res.status(404).send("User not Found!");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  signup,
  forgotPassword,
  passwordReset,
  getPasswordReset,
  getAccountDetails,
  updateInfo,
  deleteAccount,
  getUsers,
  addFriendUser,
  visitUser,
  getUser,
};
