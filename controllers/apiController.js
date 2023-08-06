const {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfiles,
  getCommunityIdByRoomCode,
} = require("../database/communityQueries");

const fetchVideoTitles = async (req, res) => {
  try {
    res.json(req.session.videoTitles); // Send the video titles as a JSON response
  } catch (error) {
    console.error("Error fetching video titles:", error.message);
    res.status(500).json({ error: "Error fetching video titles" });
  }
};

const fetchCommunitiesAndCommunityProfiles = (req, res) => {
  fetchAllCommunitiesWithProfiles((error, result) => {
    if (error) {
      console.log("Error fetching communities and community profiles:", error);
      res.status(500).json({ error: "Failed to fetch communities" });
    } else {
      res.json(result);
    }
  });
};

// Controller to create a new community
const createCommunity = async (req, res) => {
  const { roomCode, creatorId, communityName, description, isPublic } =
    req.body;

  try {
    // Check if a chatroom with the same roomCode already exists
    const existingCommunityId = await getCommunityIdByRoomCode(roomCode);
    if (existingCommunityId) {
      return res
        .status(400)
        .json({ error: "Chatroom with this roomCode already exists." });
    }

    // Add the chatroom to the Communities table
    addCommunity(roomCode, creatorId, new Date(), (error, communityId) => {
      if (error) {
        console.log("Failed to add community", error);
        return res.status(500).json({ error: "Failed to create chatroom." });
      } else {
        // Add the chatroom profile to the CommunityProfiles table
        addCommunityProfile(
          communityId,
          communityName,
          description,
          "",
          isPublic,
          (error, communityProfileId) => {
            if (error) {
              console.log("Failed to add community profile", error);
              return res
                .status(500)
                .json({ error: "Failed to create chatroom." });
            } else {
              console.log("Created Chatroom with ID:", communityId);
              return res.status(201).json({
                message: "Chatroom created successfully.",
                communityId,
              });
            }
          }
        );
      }
    });
  } catch (error) {
    console.error("Error creating chatroom:", error);
    return res.status(500).json({ error: "Failed to create chatroom." });
  }
};

module.exports = {
  fetchVideoTitles,
  fetchCommunitiesAndCommunityProfiles,
  createCommunity,
};
