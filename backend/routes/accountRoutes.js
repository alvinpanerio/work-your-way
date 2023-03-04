const express = require("express");
const {
  getLogin,
  signup,
  getForgotPassword,
} = require("../controllers/accountsController");

const router = express.Router();

router.get("/", getLogin);

router.post("/signup", signup);

router.get("/forgot", getForgotPassword);

module.exports = router;
