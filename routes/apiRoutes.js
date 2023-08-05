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

router.get("/ensure-auth", (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated
    res.json({ isAuthenticated: true });
  } else {
    // User is not authenticated
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
