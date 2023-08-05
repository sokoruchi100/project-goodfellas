const con = require("./dbConnection"); // Import the MySQL connection

function addCommunity(roomCode, creatorId, dateOfCreation, callback) {
  const query =
    "INSERT INTO Communities (roomCode, creatorId, dateOfCreation) VALUES (?, ?, ?)";
  const values = [roomCode, creatorId, dateOfCreation];

  con.query(query, values, (error, result) => {
    if (error) {
      console.log("Failed to add community", error);
      callback(error, null);
    } else {
      console.log("Added Community");
      const communityId = result.insertId;
      callback(null, communityId);
    }
  });
}

function addCommunityProfile(
  communityId,
  communityName,
  description,
  communityPicture,
  isPublic,
  callback
) {
  const query =
    "INSERT INTO CommunityProfiles (communityId, communityName, description, communityPicture, isPublic) VALUES (?, ?, ?, ?, ?)";
  const values = [
    communityId,
    communityName,
    description,
    communityPicture,
    isPublic,
  ];

  con.query(query, values, (error, result) => {
    if (error) {
      console.log("Failed to add community profile", error);
      callback(error, null);
    } else {
      console.log("Added Community Profile");
      const communityProfileId = result.insertId;
      callback(null, communityProfileId);
    }
  });
}

function fetchAllCommunitiesWithProfiles(callback) {
  const query = `
      SELECT c.*, cp.communityName, cp.description, cp.communityPicture, cp.isPublic
      FROM Communities c
      JOIN CommunityProfiles cp ON c.id = cp.communityId;
    `;

  con.query(query, (error, result) => {
    if (error) {
      console.log("Error fetching communities:", error);
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
}

async function getCommunityIdByRoomCode(roomCode) {
  const query = "SELECT id FROM Communities WHERE roomCode = ?";
  try {
    const result = await con.query(query, [roomCode]);
    if (result.length > 0) {
      return result[0].id;
    } else {
      return null; // Return null if no matching roomCode is found
    }
  } catch (error) {
    console.error("Error getting community id:", error.message);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

module.exports = {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfiles,
  getCommunityIdByRoomCode,
};
