const express = require("express");
const router = express.Router();
const passportSetup = require("../passport-setup"); // Import the passport setup file
const engineController = require("../controllers/ieController");

// Inspiration Engine
// Desired input: titles, descriptions, and keywords from the following:
//    -users previous videos(cap of 10), inputed videos, and trending videos within the niche
// Ideal ouput: Title, Idea Summary, Keywords, and Similar Videos

let video = {
  title: "",
  description: "",
  keywords: [],
};

router.post("/", engineController.gatherVideoData);

module.exports = router;
