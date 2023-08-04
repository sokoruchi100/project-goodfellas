const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const oAuthClient = new OAuth2Client({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:5000/auth/google/callback",
});

const fetchChannelDataAndVideoTitles = async (accessToken) => {
  oAuthClient.setCredentials({ access_token: accessToken });

  const youtube = google.youtube({
    version: "v3",
    auth: oAuthClient,
  });

  try {
    const channelResponse = await youtube.channels.list({
      part: "snippet",
      mine: true,
    });

    if (
      !channelResponse.data.items ||
      channelResponse.data.items.length === 0
    ) {
      throw new Error("No channel data found.");
    }

    //Will only connect to your first youtube channel, we could implement features where you could choose, but seems unecessary for now
    const channelId = channelResponse.data.items[0].id;
    const channelName = channelResponse.data.items[0].snippet.title;
    const channelPicture =
      channelResponse.data.items[0]?.snippet?.thumbnails?.default?.url ||
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"; // Replace with your default picture URL
    //console.log("This is the found user name:", channelResponse.data.items[0].snippet.title);

    const response = await youtube.search.list({
      part: "snippet",
      channelId: channelId, // Replace with your channel ID
      maxResults: 50, // The number of videos to fetch, adjust as needed
      type: "video",
    });

    // Fetch video titles using the YouTube API as described above
    const videoTitles = response.data.items.map((item) => item.snippet.title);

    // You can add more logic here to handle the fetched data as per your requirements

    return {
      channelId: channelId,
      channelName: channelName,
      channelPicture: channelPicture,
      videoTitles: videoTitles,
    };
  } catch (error) {
    console.error(
      "Error fetching channel data and video titles:",
      error.message
    );
    throw new Error("Error fetching channel data and video titles");
  }
};

module.exports = {
  fetchChannelDataAndVideoTitles,
};
