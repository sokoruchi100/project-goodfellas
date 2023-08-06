const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const apiController = require("../controllers/apiController");
const { getUserIdByChannelId } = require("../database/userQueries"); // Import the userQueries file

// Endpoint to get all video titles from the user's YouTube channel
router.get("/videos", ensureAuthenticated, apiController.fetchVideoTitles);

router.get(
  "/communities",
  ensureAuthenticated,
  apiController.fetchCommunitiesAndCommunityProfiles
);

router.get("/ensure-auth", (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated
    res.json({ isAuthenticated: true });
  } else {
    // User is not authenticated
    res.json({ isAuthenticated: false });
  }
});

router.get("/user-id", (req, res) => {
  getUserIdByChannelId(req.session.channelId, (error, userId) => {
    if (userId) {
      console.log("User ID:", userId);
      res.json({ userId });
    } else {
      return res.status(401).json({ message: "User not authenticated" });
    }
  });
});

// Route to create a new chatroom
router.post("/create-community", apiController.createCommunity);

module.exports = router;
