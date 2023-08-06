// database/userQueries.js

const con = require("./dbConnection"); // Import the MySQL connection

function addUser(id, username, callback) {
  //For the date coloumn
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`;

  const query =
    "INSERT INTO Users (id, channelId, channelName, dateOfCreation) VALUES (NULL, ?, ?, ?)";
  const values = [id, username, currentDate];

  con.query(query, values, (error, result) => {
    if (error) {
      res.status(500).json({ error: "Failed to add user" });
    } else {
      const userId = result.insertId;
      callback(userId);
    }
  });
}

function addUserProfile(userId, profilePicture, displayName) {
  const query =
    "INSERT INTO UserProfiles (userId, profilePicture, displayName, isSubscribed) VALUES (?, ?, ?, ?)";
  const values = [userId, profilePicture, displayName, false];

  con.query(query, values, (error, result) => {
    if (error) {
      console.log("Failed to add userProfile", error);
      res.status(500).json({ error: "Failed to add userProfile" });
    } else {
    }
  });
}

function getUserIdByChannelId(channelId, callback) {
  const query = "SELECT id FROM Users WHERE channelId = ?";
  const values = [channelId];

  con.query(query, values, (error, result) => {
    if (error) {
      console.log("Error getting user ID:", error);
      callback(error, null);
    } else {
      if (result.length > 0) {
        const userId = result[0].id;
        callback(null, userId);
      } else {
        callback(null, null); // Return null if no matching channelId is found
      }
    }
  });
}

module.exports = {
  addUser,
  addUserProfile,
  getUserIdByChannelId,
};
