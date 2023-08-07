const express = require("express");
const router = express.Router();

const { getUserTags, postUserTags } = require("../controllers/tagController");

router.get("/userTags/:userId", getUserTags);

router.post("/userTags/:userId", postUserTags);

module.exports = router;
