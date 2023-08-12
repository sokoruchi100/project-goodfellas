const express = require("express");
const router = express.Router();

const {
  authenticate,
  handleGoogleCallback,
  logout,
  ensureAuthenticated,
  authenticateCallback,
} = require("../controllers/authController");

// Endpoint to initiate the Google OAuth flow
router.get("/google", authenticate);

//Endpoint to handle the Google OAuth callback
router.get("/google/callback", authenticateCallback, handleGoogleCallback);

//Logs user out of account
router.post("/logout", logout);

//checks whether the user is authenticated
router.get("/ensure", ensureAuthenticated);

module.exports = router;
