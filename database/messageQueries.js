const con = require("./dbConnection"); // Import the MySQL connection

async function saveMessageToDatabase(communityId, { senderId, content }) {
  const query =
    "INSERT INTO Messages (communityId, senderId, content) VALUES (?, ?, ?)";
  const values = [communityId, senderId, content];
  try {
    await con.query(query, values);
  } catch (error) {
    console.error("Error saving message to database:", error.message);
  }
}

async function loadAndSendMessages(communityId) {
  if (!communityId) {
    console.error("Invalid communityId:", communityId);
    return;
  }
  const query = `
    SELECT 
      up.displayName,
      up.profilePicture,
      m.content, 
      m.timeStamp 
    FROM Messages m
    JOIN UserProfiles up
      ON up.userId = m.senderId
    WHERE communityId = ?`;

  return new Promise((resolve, reject) => {
    con.query(query, [communityId], (err, result) => {
      if (err) {
        console.error("Error loading messages:", err.message);
        console.trace();
        reject(err);
        return;
      }

      const messages = result;
      // Convert BLOB to string, only for urls
      messages.forEach((row) => {
        row.profilePicture = row.profilePicture.toString();
      });

      resolve(messages);
    });
  });
}

async function deleteMessages(communityId) {
  const query = "DELETE FROM Messages WHERE communityId = ?";
  return new Promise((resolve, reject) => {
    con.query(query, [communityId], (error, results) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

module.exports = { saveMessageToDatabase, loadAndSendMessages, deleteMessages };
