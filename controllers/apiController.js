const {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfilesAndTags,
  getCommunityIdByRoomCode,
  addMemberWithCommunityId,
} = require("../database/communityQueries");

const fetchVideoTitles = async (req, res) => {
  try {
    res.json(req.session.videoTitles); // Send the video titles as a JSON response
  } catch (error) {
    console.error("Error fetching video titles:", error.message);
    res.status(500).json({ error: "Error fetching video titles" });
  }
};

const fetchCommunitiesWithProfilesAndTags = (req, res) => {
  fetchAllCommunitiesWithProfilesAndTags((error, result) => {
    if (error) {
      res.status(500).json({ error: "Failed to fetch communities" });
    } else {
      const newResult = {};

      result.forEach((row) => {
        // If the community does not exist in the result, initialize it
        if (!newResult[row.id]) {
          newResult[row.id] = {
            id: row.id,
            roomCode: row.roomCode,
            creatorId: row.creatorId,
            dateOfCreation: row.dateOfCreation,
            communityName: row.communityName,
            description: row.description,
            communityPicture: row.communityPicture,
            isPublic: row.isPublic,
            tags: [],
          };
        }

        // Push the tag to the community's tags array
        newResult[row.id].tags.push(row.tag);
      });

      // Convert the result object to an array
      const output = Object.values(newResult);

      res.json(output);
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
        //console.log("Error creating chatroom:", error);
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
              console.log("Error creating chatroom:", error);
              return res
                .status(500)
                .json({ error: "Failed to create chatroom." });
            } else {
              addMemberWithCommunityId(
                communityId,
                creatorId,
                (error, result) => {
                  if (error) {
                    return res.status(500).json({
                      error: "Failed to add creator to the membership table.",
                    });
                  } else {
                    return res.status(201).json({
                      message: "Chatroom created successfully.",
                      communityId,
                    });
                  }
                }
              );
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
  fetchCommunitiesWithProfilesAndTags,
  createCommunity,
};
