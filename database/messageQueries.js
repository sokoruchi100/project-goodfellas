const con = require("./dbConnection"); // Import the MySQL connection

async function saveMessageToDatabase(communityId, { text, sender }) {
  const query =
    "INSERT INTO messages (communityId, senderId, content, timestamp) VALUES (?, ?, ?, ?)";
  const values = [communityId, sender, text, new Date()];
  try {
    con.query(query, values);
  } catch (error) {
    console.error("Error saving message to database:", error.message);
  }
}

async function loadAndSendMessages(communityId, callback) {
  const query = "SELECT * FROM messages WHERE communityId = ?";
  try {
    const messages = con.query(query, [communityId]);
    callback(messages);
  } catch (error) {
    console.error("Error loading messages:", error.message);
  }
}

module.exports = { saveMessageToDatabase, loadAndSendMessages };
