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

function getCommunityIdByRoomCode(roomCode) {
  const query = "SELECT id FROM Communities WHERE roomCode = ?";
  return new Promise((resolve, reject) => {
    con.query(query, [roomCode], (error, result) => {
      if (error) {
        console.error("Error getting community id:", error.message);
        reject(error); // Reject the promise with the error
      } else {
        resolve(result[0]?.id); // Resolve the promise with the ID or undefined if the result is empty
      }
    });
  });
}

async function checkIfUserIsMember(roomCode, userId) {
  const query = `
  SELECT *
  FROM Membership m
  JOIN Communities c ON m.communityId = c.id
  WHERE c.roomCode = ? AND m.userId = ?;
`;
  const values = [roomCode, userId];

  return new Promise((resolve, reject) => {
    con.query(query, values, (error, result) => {
      if (error) {
        console.log("Error checking community membership:", error);
        reject(error);
      } else {
        console.log(result);
        resolve(result.length > 0);
      }
    });
  });
}

async function addMemberToCommunity(userId, roomCode) {
  try {
    const communityId = await getCommunityIdByRoomCode(roomCode);
    if (!communityId) {
      throw new Error("Failed to get communityId for room code");
    }
    const query = "INSERT INTO Membership (userId, communityId) VALUES (?, ?)";
    const values = [userId, communityId];

    return new Promise((resolve, reject) => {
      con.query(query, values, (error, result) => {
        if (error) {
          console.log("Failed to add user to Membership table", error);
          reject(error);
        } else {
          console.log("Added user to Membership table");
          resolve();
        }
      });
    });
  } catch (error) {
    console.log("Error getting communityId:", error);
    throw error;
  }
}

module.exports = {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfiles,
  getCommunityIdByRoomCode,
  checkIfUserIsMember,
  addMemberToCommunity,
};
