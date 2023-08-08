const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const apiController = require("../controllers/apiController");
const {
  getUserIdByChannelId,
  getUserIdByName,
} = require("../database/userQueries"); // Import the userQueries file
const {
  checkIfUserIsMember,
  addMemberToCommunity,
  checkIfCommunityIsPrivate,
  checkIfUserIsOwner,
  deleteCommunity,
  deleteCommunityProfile,
  deleteMembership,
} = require("../database/communityQueries");
const { deleteMessages } = require("../database/messageQueries");
const { deleteCommunityTags } = require("../database/tagQueries");

// Endpoint to get all video titles from the user's YouTube channel
router.get("/videos", ensureAuthenticated, apiController.fetchVideoTitles);

router.get(
  "/communities",
  ensureAuthenticated,
  apiController.fetchCommunitiesWithProfilesAndTags
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

//Get user-id by channel name
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
  console.log("USER ID:" + userId);
  try {
    const isAlreadyMember = await checkIfUserIsMember(roomCode, userId);
    if (isAlreadyMember) {
      return res
        .status(200)
        .json({ success: false, message: "User is already a member" });
    }
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

router.get("/is-private/:roomCode", async (req, res) => {
  const { roomCode } = req.params;

  try {
    const isPrivate = await checkIfCommunityIsPrivate(roomCode);
    res.status(200).json({ isPrivate });
  } catch (error) {
    res.status(500).json({ error: "Error checking community privacy" });
  }
});

router.get("/is-owner/:roomCode/:userId", async (req, res) => {
  const { roomCode, userId } = req.params;
  try {
    const isOwner = await checkIfUserIsOwner(roomCode, userId);
    res.status(200).json({ isOwner });
  } catch (error) {
    res.status(500).json({ error: "Failed to check if user is the owner" });
  }
});

// Route to find a user by name
router.post("/find-user", async (req, res) => {
  const { name } = req.body;
  try {
    const userId = await getUserIdByName(name);
    if (userId) {
      res.status(200).json({ userId });
    } else {
      res.status(200).json({ error: "No user found with the given name" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.delete("/communities/:communityId", (req, res) => {
  const { communityId } = req.params;
  deleteMembership(communityId);
  deleteMessages(communityId);
  deleteCommunityProfile(communityId);
  deleteCommunity(communityId);
});

module.exports = router;
