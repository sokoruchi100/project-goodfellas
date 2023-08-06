const con = require("../database/dbConnection"); // Import the MySQL connection
const { addUser, addUserProfile } = require("../database/userQueries"); // Import the userQueries file
const { fetchChannelDataAndVideoTitles } = require("../youtube-api"); // Import the YouTube API functions

const handleGoogleCallback = async (req, res) => {
  try {
    const { channelId, channelName, channelPicture, videoTitles } =
      await fetchChannelDataAndVideoTitles(req.user.tokens.access_token);

    // Session storage, for quicker and easier access
    req.session.channelId = channelId;
    req.session.channelName = channelName;
    req.session.channelPicture = channelPicture;
    req.session.videoTitles = videoTitles;

    //Firstly check if channel id previously exists in our database
    //If not add the channelId and channelName to our database
    const querySearchForID = "SELECT * FROM Users WHERE channelId=?";
    con.query(querySearchForID, [channelId], (error, result) => {
      if (error) {
        console.log("Database error", error);
        res.status(500).json({ error: "Database error" });
      } else if (result.length == 0) {
        addUser(channelId, channelName, (userId) => {
          // The callback function will be called with the added user's ID
          addUserProfile(userId, channelPicture, channelName);
        });
      } else {
        //Welcome to callback hell
        console.log("User already exists in our database");

        //Adds UserProfile, but could be deleted since not really needed unless in certain circumstances
        const querySearchForProfile =
          "SELECT * FROM UserProfiles WHERE userId=?";
        con.query(
          querySearchForProfile,
          [result[0].id],
          (userProfileError, userProfileResult) => {
            if (error) {
              console.log("Database error", userProfileError);
              res.status(500).json({ error: "Database error" });
            } else if (userProfileResult.length == 0) {
              addUserProfile(result[0].id, channelPicture, channelName);
            }
          }
        );
      }
    });
    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
    // Redirect to the dashboard page after fetching the channel ID
    console.error("Error fetching channel ID:", error.message);
    res.status(500).send("Error fetching channel ID. Please try again.");
  }
};

const logout = (req, res) => {
  // Passport provides a logout() function to clear the user session
  req.logout(function (err) {
    if (err) {
      console.error("Error while logging out:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful" }); // Send response back to client
  });
};

module.exports = {
  handleGoogleCallback,
  logout,
};
