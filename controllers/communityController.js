const {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfilesAndTags,
  getCommunityIdByRoomCode,
  deleteCommunity,
  deleteCommunityProfile,
  checkIfUserIsOwner,
  checkIfCommunityIsPrivate,
  getCommunityNameByRoomCode,
} = require("../database/communityQueries");
const {
  addMemberWithCommunityId,
  deleteMembership,
} = require("../database/membershipQueries");
const { deleteMessages } = require("../database/messageQueries");

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
const createCommunity = async ({ body }, res) => {
  try {
    const {
      roomCode,
      creatorId,
      communityName,
      description,
      isPublic,
      communityPicture,
    } = body;

    if (!communityPicture) {
      return res.status(400).send({ message: "Image is required" });
    }

    // Check if a chatroom with the same roomCode already exists
    const existingCommunityId = await getCommunityIdByRoomCode(roomCode);
    if (existingCommunityId) {
      return res
        .status(400)
        .json({ error: "Chatroom with this roomCode already exists." });
    }

    // Add the chatroom to the Communities table
    const communityId = await addCommunity(roomCode, creatorId, new Date());
    console.log("COMMUNITY ID AFTER AWAIT: ", communityId);
    // Add the chatroom profile to the CommunityProfiles table
    await addCommunityProfile(
      communityId,
      communityName,
      description,
      communityPicture,
      isPublic
    );

    // Add the creator to the members table
    await addMemberWithCommunityId(communityId, creatorId);

    return res.status(201).json({
      message: "Chatroom created successfully.",
      communityId,
    });
  } catch (error) {
    console.error("Error creating chatroom:", error);
    return res.status(500).json({ error: "Failed to create chatroom." });
  }
};

const getCommunityName = async (req, res) => {
  const { roomCode } = req.params;
  try {
    const communityName = await getCommunityNameByRoomCode(roomCode);
    res.status(200).json({ communityName });
  } catch (error) {
    res.status(500).json({ error: "Failed to get community name" });
  }
};

const isPrivate = async (req, res) => {
  const { roomCode } = req.params;

  try {
    const isPrivate = await checkIfCommunityIsPrivate(roomCode);
    res.status(200).json({ isPrivate });
  } catch (error) {
    res.status(500).json({ error: "Error checking community privacy" });
  }
};

const isOwner = async (req, res) => {
  const { roomCode, userId } = req.params;
  try {
    const isOwner = await checkIfUserIsOwner(roomCode, userId);
    res.status(200).json({ isOwner });
  } catch (error) {
    res.status(500).json({ error: "Failed to check if user is the owner" });
  }
};

const communityDeletion = async (req, res) => {
  const { communityId } = req.params;
  deleteMembership(communityId);
  deleteMessages(communityId);
  deleteCommunityProfile(communityId);
  deleteCommunity(communityId);
};

module.exports = {
  fetchCommunitiesWithProfilesAndTags,
  createCommunity,
  isPrivate,
  isOwner,
  communityDeletion,
  getCommunityName,
};
