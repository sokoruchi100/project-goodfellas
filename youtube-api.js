const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const oAuthClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:5000/auth/google/callback",
});

const fetchChannelIdAndVideoTitles = async (accessToken) => {
  oAuthClient.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({
    version: "v3",
    auth: oAuthClient,
  });

  const channelResponse = await youtube.channels.list({
    part: "snippet",
    mine: true,
  });

  const channelId = channelResponse.data.items[0].id;
  const channelName = channelResponse.data.items[0].snippet.title;
  //console.log("This is the found user name:", channelResponse.data.items[0].snippet.title);

  const response = await youtube.search.list({
    part: "snippet",
    channelId: channelId, // Replace with your channel ID
    maxResults: 50, // The number of videos to fetch, adjust as needed
    type: "video",
  });
  try {
    // Fetch video titles using the YouTube API as described above
    const videoTitles = response.data.items.map((item) => item.snippet.title);

    // You can add more logic here to handle the fetched data as per your requirements

    return {
      channelId: channelId,
      channelName: channelName,
      videoTitles: videoTitles,
    };
  } catch (error) {
    console.error("Error fetching video titles:", error.message);
    throw new Error("Error fetching video titles");
  }
};

module.exports = {
  fetchChannelIdAndVideoTitles,
};
