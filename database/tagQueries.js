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

// Links tag with community
function linkCommunityWithTag(communityId, tagId) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO CommunityTag (communityId, tagId) VALUES (?, ?) ON DUPLICATE KEY UPDATE communityId=VALUES(communityId), tagId=VALUES(tagId)";
    con.query(query, [communityId, tagId], (error, results) => {
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

// Deletes all community tag links
function deleteAllCommunityTags(communityId) {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM CommunityTag WHERE communityId = ?";
    con.query(query, [communityId], (error, results) => {
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

// Fetches all tags from a community
function fetchCommunityTags(communityId) {
  return new Promise((resolve, reject) => {
    const query =
      "SELECT t.tag FROM Tags t JOIN CommunityTag ct ON t.id = ct.tagId WHERE ct.communityId = ?";
    con.query(query, [communityId], (error, results) => {
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
  linkCommunityWithTag,
  deleteAllCommunityTags,
  fetchCommunityTags,
};

//On explore page, search bar with text field for tags and button to find communities
//returns all communities with same tag
//Multiple tags, uses and to search if community contains both tags
//if no community found, say no communities found
//If empty, just show all tags
//uses tag util to convert text into array of tags
//sends array to api call that does database query
//Join communities with communityTags and Tags WHERE tag = tag
//Get an array of community ids for each tag
//combine every array in a 2d array.
//Perform a function that combines all the arrays with the same element

// function commonElements(arrays) {
//   // Start with the first array
//   return arrays[0].filter(element =>
//       // Check if every other array contains this element
//       arrays.every(array => array.includes(element))
//   );
// }

//fetchAllCommunitiesWithTags -
