const express = require("express");
const router = express.Router();

const { addMember, isMember } = require("../controllers/membershipController");

// Add member to community
router.post("/", addMember);

router.get("/is-member/:roomCode/:userId", isMember);

module.exports = router;
