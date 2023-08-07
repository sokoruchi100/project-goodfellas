const con = require("../database/dbConnection"); // Import the MySQL connection
const { addUser, addUserProfile } = require("../database/userQueries"); // Import the userQueries file
const { fetchChannelDataAndVideoTitles } = require("../youtube-api"); // Import the YouTube API functions
const { getUserIdByChannelId } = require("../database/userQueries");

const handleGoogleCallback = async (req, res) => {
  try {
    const { channelId, channelName, channelPicture, videoTitles } =
      await fetchChannelDataAndVideoTitles(req.user.tokens.access_token);

    req.session.channelId = channelId;
    req.session.channelName = channelName;
    req.session.channelPicture = channelPicture;
    req.session.videoTitles = videoTitles;

    getUserIdByChannelId(channelId, (error, userId) => {
      if (error) {
        console.log("Error getting userId:", error);
        res.status(500).json({ error: "Database error" });
      } else {
        req.session.userId = userId; // Store the userId in the session

        if (!userId) {
          addUser(channelId, channelName, (newUserId) => {
            // The callback function will be called with the added user's ID
            addUserProfile(newUserId, channelPicture, channelName);
            req.session.userId = newUserId; // Update the userId in the session
          });
        }
      }
    });

    res.redirect("http://localhost:3000/dashboard");
  } catch (error) {
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
