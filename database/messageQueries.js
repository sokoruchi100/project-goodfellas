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
  const query =
    "SELECT senderId, content, timeStamp FROM Messages WHERE communityId = ?";

  return new Promise((resolve, reject) => {
    con.query(query, [communityId], (err, result) => {
      if (err) {
        console.error("Error loading messages:", err.message);
        console.trace();
        reject(err);
        return;
      }
      resolve(result);
    });
  });
}

module.exports = { saveMessageToDatabase, loadAndSendMessages };
