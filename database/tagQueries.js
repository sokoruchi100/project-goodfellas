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
    con.query(query, [userId, tagId], (error, results) => {
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

module.exports = {
  insertTag,
  linkUserWithTag,
  deleteUserTagLink,
  fetchUserTags,
};

//FrontEnd
//First create box that takes inputs and a save button
//Each tag is separated by spaces
//Turn entire string into an array of tags based on spaces, set all as lowercase
//Get UserId and store it across the app.js
//Send array as the body to an api call to the backend post(/userTags/{userId})

//BackEnd
//Route to get API call
//Obtain data from body and param
//call deleteAllUserTags
//map through each element in array
//insertTag, then linkUserWithTag

//FrontEnd, again
//UseEffect, performs api call Get(/userTags/{userId}),
//Process the array of tags into a string with spaces between each elemnt
//Display it in text field

//Backend, again
//Performs fetchUserTags with userId from param
//Return the usertags as an array
