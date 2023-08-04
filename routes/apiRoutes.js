const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const apiController = require("../controllers/apiController");

// Endpoint to get all video titles from the user's YouTube channel
router.get("/videos", ensureAuthenticated, apiController.fetchVideoTitles);
router.get(
  "/communities",
  ensureAuthenticated,
  apiController.fetchCommunitiesAndCommunityProfiles
);
module.exports = router;
