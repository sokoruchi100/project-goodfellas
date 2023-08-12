const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const path = require("path");
const axios = require("axios");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const oAuthClient = new OAuth2Client({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: "http://localhost:5000/auth/google/callback",
});


// Users Channel Details
let channelID = "";
let videos = [];

class Video {
    constructor(title, description, thumbnail) {
        this.title = title;
        this.description = description;
        this.thumbnail = thumbnail;
    }
}

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
    const videoDescriptions = response.data.items.map((item) => item.snippet.description);

    // You can add more logic here to handle the fetched data as per your requirements
    // Updating our channel details
    channelID = channelId;
    if (response.data.items.length > 3)
    {
      for (let i = 0; i < 3; i++)
      {
        let vidTitle = response.data.items[i].snippet.title;
        let vidDesc = response.data.items[i].snippet.description;
        let vidTN = response.data.items[i].snippet.thumbnails.high.url;
        let vid = new Video(vidTitle, vidDesc, vidTN);
        videos.push(vid);
      }
    }
    else if (response.data.items.length == 0){
      // Do nothing if there are no videos
    }
    else
    {
      for (let i = 0; i < response.data.items.length; i++)
      {
        let vidTitle = response.data.items[i].snippet.title;
        let vidDesc = response.data.items[i].snippet.description;
        let vidTN = response.data.items[i].snippet.thumbnails.high.url;
        let vid = new Video(vidTitle, vidDesc, vidTN);
        videos.push(vid);
      }
    }
    
    return {
      channelId: channelId,
      channelName: channelName,
      channelPicture: channelPicture,
      videoTitles: videoTitles,
      videoDescriptions: videoDescriptions
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
  videos
};
