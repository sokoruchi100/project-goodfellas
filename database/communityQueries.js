const con = require("./dbConnection"); // Import the MySQL connection

function addCommunity(roomCode, creatorId, dateOfCreation, callback) {
  const query =
    "INSERT INTO Communities (roomCode, creatorId, dateOfCreation) VALUES (?, ?, ?)";
  const values = [roomCode, creatorId, dateOfCreation];

  con.query(query, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
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
      callback(error, null);
    } else {
      const communityProfileId = result.insertId;
      callback(null, communityProfileId);
    }
  });
}

function fetchAllCommunitiesWithProfilesAndTags(callback) {
  const query = `
  SELECT c.*, cp.communityName, cp.description, cp.communityPicture, cp.isPublic, t.tag
  FROM Communities c
  JOIN CommunityProfiles cp ON c.id = cp.communityId
  JOIN CommunityTag ct ON ct.communityId = c.id
  JOIN Tags t ON ct.tagId = t.id
    `;

  con.query(query, (error, result) => {
    if (error) {
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
        reject(error);
      } else {
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
          reject(error);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    throw error;
  }
}

function addMemberWithCommunityId(communityId, userId, callback) {
  const query = "INSERT INTO Membership (communityId, userId) VALUES (?, ?)";
  const values = [communityId, userId];

  con.query(query, values, (error, result) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, result);
    }
  });
}

async function checkIfCommunityIsPrivate(roomCode) {
  const query = `
      SELECT cp.isPublic
      FROM Communities c
      JOIN CommunityProfiles cp ON c.id = cp.communityId
      WHERE c.roomCode = ?;
    `;

  return new Promise((resolve, reject) => {
    con.query(query, [roomCode], (error, result) => {
      if (error) {
        reject(error);
      } else {
        // If it's public in the database, return false for isPrivate and vice versa.
        resolve(!result[0]?.isPublic);
      }
    });
  });
}

async function checkIfUserIsOwner(roomCode, userId) {
  const query = "SELECT creatorId FROM Communities WHERE roomCode = ?";
  return new Promise((resolve, reject) => {
    con.query(query, [roomCode], (error, results) => {
      if (error) reject(error);
      else resolve(results[0].creatorId == userId);
    });
  });
}

async function deleteCommunity(communityId) {
  const query = "DELETE FROM Communities WHERE id = ?";
  return new Promise((resolve, reject) => {
    con.query(query, [communityId], (error, results) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function deleteCommunityProfile(communityId) {
  const query = "DELETE FROM CommunityProfiles WHERE communityId = ?";
  return new Promise((resolve, reject) => {
    con.query(query, [communityId], (error, results) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

async function deleteMembership(communityId) {
  const query = "DELETE FROM Membership WHERE communityId = ?";
  return new Promise((resolve, reject) => {
    con.query(query, [communityId], (error, results) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

module.exports = {
  addCommunity,
  addCommunityProfile,
  fetchAllCommunitiesWithProfilesAndTags,
  getCommunityIdByRoomCode,
  checkIfUserIsMember,
  addMemberToCommunity,
  addMemberWithCommunityId,
  checkIfCommunityIsPrivate,
  checkIfUserIsOwner,
  deleteCommunity,
  deleteCommunityProfile,
  deleteMembership,
};
