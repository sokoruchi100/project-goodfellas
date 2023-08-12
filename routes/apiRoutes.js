const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const { fetchVideoTitles } = require("../controllers/apiController");

// Endpoint to get all video titles from the user's YouTube channel
router.get("/videos", ensureAuthenticated, fetchVideoTitles);

module.exports = router;
