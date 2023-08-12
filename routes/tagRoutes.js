const express = require("express");
const router = express.Router();

const {
  getUserTags,
  postUserTags,
  getCommunityTags,
  postCommunityTags,
} = require("../controllers/tagController");

router.get("/userTags/:userId", getUserTags);

router.post("/userTags/:userId", postUserTags);

router.get("/communityTags/:communityId", getCommunityTags);

router.post("/communityTags/:communityId", postCommunityTags);

module.exports = router;
