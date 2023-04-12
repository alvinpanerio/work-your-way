const express = require("express");
const {
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
} = require("../controllers/accountsController");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot", forgotPassword);
router.get("/forgot/:resetToken", getPasswordReset);
router.put("/forgot/:resetToken", passwordReset);
router.get("/:id", getAccountDetails);
router.post("/edit-info/:id", updateInfo);
router.post("/delete-account/:email", deleteAccount);
router.get("/get/users", getUsers);
router.post("/add-friend/:uid", addFriendUser);
router.get("/user/:uid", visitUser);
router.get("/find-user/:uid", getUser);

module.exports = router;
