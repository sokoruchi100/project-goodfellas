const con = require("./dbConnection"); // Import the MySQL connection

// Inserts new tag
function insertTag(tag) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO Tags (tag) VALUES (?) ON DUPLICATE KEY UPDATE tag=VALUES(tag)";
    con.query(query, [tag], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Links tag with user
function linkUserWithTag(userId, tagId) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO UserTag (userId, tagId) VALUES (?, ?) ON DUPLICATE KEY UPDATE userId=VALUES(userId), tagId=VALUES(tagId)";
    con.query(query, [userId, tagId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Deletes all user tag links
function deleteAllUserTags(userId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM UserTag WHERE userId = ?";
    con.query(query, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Fetches all tags from a user
function fetchUserTags(userId) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT t.tag FROM Tags t JOIN UserTag ut ON t.id = ut.tagId WHERE ut.userId = ?";
    con.query(query, [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.map((result) => result.tag)); // This will return an array of tags for the user
      }
    });
  });
}

// Fetches the ID of a tag by its name
function getTagIdByName(tag) {
  return new Promise((resolve, reject) => {
    const query = "SELECT id FROM Tags WHERE tag = ?";
    con.query(query, [tag], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length > 0) {
          resolve(results[0].id); // This will return the ID of the tag
        } else {
          reject(new Error("No tag found with the given name."));
        }
      }
    });
  });
}

module.exports = {
  insertTag,
  linkUserWithTag,
  deleteAllUserTags,
  fetchUserTags,
  getTagIdByName,
};
