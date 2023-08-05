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

module.exports = {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfiles,
};
