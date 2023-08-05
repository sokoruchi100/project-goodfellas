const communityQueries = require("../database/communityQueries");

const fetchVideoTitles = async (req, res) => {
  try {
    res.json(req.session.videoTitles); // Send the video titles as a JSON response
  } catch (error) {
    console.error("Error fetching video titles:", error.message);
    res.status(500).json({ error: "Error fetching video titles" });
  }
};

const fetchCommunitiesAndCommunityProfiles = (req, res) => {
  communityQueries.fetchAllCommunitiesWithProfiles((error, result) => {
    if (error) {
      console.log("Error fetching communities and community profiles:", error);
      res.status(500).json({ error: "Failed to fetch communities" });
    } else {
      res.json(result);
    }
  });
};

module.exports = { fetchVideoTitles, fetchCommunitiesAndCommunityProfiles };
