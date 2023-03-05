const express = require("express");
const {
  login,
  signup,
  getForgotPassword,
} = require("../controllers/accountsController");

const router = express.Router();

router.post("/login", login);

router.post("/signup", signup);

router.get("/forgot", getForgotPassword);

module.exports = router;
