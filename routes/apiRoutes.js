const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const apiController = require("../controllers/apiController");
const { getUserIdByChannelId } = require("../database/userQueries"); // Import the userQueries file
const {
  getCommunityIdByRoomCode,
  checkIfUserIsMember,
  addMemberToCommunity,
} = require("../database/communityQueries");

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
      res.json({ userId });
    } else {
      return res.status(401).json({ message: "User not authenticated" });
    }
  });
});

// Route to create a new chatroom
router.post("/create-community", apiController.createCommunity);

// Route to check if the user and community IDs exist in the Membership table
router.get("/has-joined/:roomCode/:userId", async (req, res) => {
  const { roomCode, userId } = req.params;

  try {
    const hasJoined = await checkIfUserIsMember(roomCode, userId);
    res.status(200).json({ hasJoined });
  } catch (error) {
    res.status(500).json({ error: "Error checking community membership" });
  }
});

// Route to add a user to the Membership table
router.post("/add-to-membership", async (req, res) => {
  const { userId, roomCode } = req.body;
  try {
    await addMemberToCommunity(userId, roomCode);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user to Membership table" });
  }
});

router.get("/is-user-member", async (req, res) => {
  const { roomCode, userId } = req.query;
  try {
    const isMember = await checkIfUserIsMember(roomCode, userId);
    res.status(200).json({ isMember: isMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to check if user is member" });
  }
});

module.exports = router;
