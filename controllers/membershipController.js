const {
  checkIfUserIsMember,
  addMemberToCommunity,
} = require("../database/membershipQueries");

const addMember = async (req, res) => {
  console.log("ADDING MEMBER TO COMMUNITY");
  const { userId, roomCode } = req.body;
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
};

const isMember = async (req, res) => {
  const { roomCode, userId } = req.params;
  try {
    const isMember = await checkIfUserIsMember(roomCode, userId);
    res.status(200).json({ isMember: isMember });
  } catch (error) {
    res.status(500).json({ error: "Failed to check if user is member" });
  }
};

module.exports = { addMember, isMember };
