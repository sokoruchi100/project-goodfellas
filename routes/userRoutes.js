const express = require("express");
const router = express.Router();

const {
  getIdByChannel,
  getProfile,
  findUser,
} = require("../controllers/userController");

//Get user-id by channel id
router.get("/id", getIdByChannel);

//Get user profile by user id
router.get("/profile/:userId", getProfile);

//Get user by name
router.get("/find-user/:name", findUser);

module.exports = router;
