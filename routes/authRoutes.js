const express = require("express");
const router = express.Router();
const passportSetup = require("../passport-setup"); // Import the passport setup file
const authController = require("../controllers/authController");

// Endpoint to initiate the Google OAuth flow
router.get(
  "/google",
  passportSetup.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
  })
);

// Endpoint to handle the Google OAuth callback
router.get(
  "/google/callback",
  passportSetup.authenticate("google", { failureRedirect: "/login-failed" }),
  authController.handleGoogleCallback
);

module.exports = router;
