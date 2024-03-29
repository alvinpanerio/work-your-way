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
  confirmUser,
  getFriends,
} = require("../controllers/accountsController");

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/forgot-password", forgotPassword);
router.get("/forgot/:resetToken", getPasswordReset);
router.put("/forgot/:resetToken", passwordReset);
router.get("/:id", getAccountDetails);
router.post("/edit-info/:id", updateInfo);
router.post("/delete-account/:email", deleteAccount);
router.get("/get/users", getUsers);
router.post("/add-friend/:uid", addFriendUser);
router.get("/user/:uid", visitUser);
router.get("/find-user/:uid", getUser);
router.post("/confirm-user/:uid", confirmUser);
router.get("/get-friends/:uid", getFriends);

module.exports = router;
