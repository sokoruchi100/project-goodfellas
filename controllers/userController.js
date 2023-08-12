const {
  getUserIdByChannelId,
  getUserIdByName,
  getUserProfile,
} = require("../database/userQueries"); // Import the userQueries file

const getIdByChannel = (req, res) => {
  getUserIdByChannelId(req.session.channelId, (error, userId) => {
    if (userId) {
      res.json({ userId });
    } else {
      return res.status(401).json({ message: "User not authenticated" });
    }
  });
};

const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const userProfile = await getUserProfile(userId);
    if (userProfile) {
      res.status(200).json({
        displayName: userProfile.displayName,
        profilePicture: userProfile.profilePicture,
      });
    } else {
      res.status(404).json({ error: "User profile not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

const findUser = async (req, res) => {
  const { name } = req.params;
  console.log(name);
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
};

module.exports = { getIdByChannel, getProfile, findUser };
