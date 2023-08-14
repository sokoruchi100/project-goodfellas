const con = require("./dbConnection"); // Import the MySQL connection
const { getCommunityIdByRoomCode } = require("./communityQueries");

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

//adds with roomcode
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

//adds with communityId
function addMemberWithCommunityId(communityId, userId) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO Membership (communityId, userId) VALUES (?, ?)";
    const values = [communityId, userId];

    con.query(query, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
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
  checkIfUserIsMember,
  addMemberToCommunity,
  addMemberWithCommunityId,
  deleteMembership,
};
