const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../middleware/authMiddleware");
const {
  fetchCommunitiesWithProfilesAndTags,
  createCommunity,
  isPrivate,
  isOwner,
  communityDeletion,
} = require("../controllers/communityController");

//Get All Communities
router.get("/", ensureAuthenticated, fetchCommunitiesWithProfilesAndTags);

// Create new Community
router.post("/", createCommunity);

//Check Community Privacy
router.get("/is-private/:roomCode", isPrivate);

//Checks if user is owner of community
router.get("/is-owner/:roomCode/:userId", isOwner);

//Delete Community
router.delete("/:communityId", communityDeletion);

module.exports = router;
