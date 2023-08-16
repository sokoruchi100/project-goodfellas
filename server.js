//Modules
const http = require("http");
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const sharedSession = require("express-socket.io-session");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { videos } = require("./youtube-api.js");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});
const multer = require("multer");

//Files
const passportSetup = require("./passport-setup"); // Import the passport setup file
const initializeSocketServer = require("./socket-server");
const con = require("./database/dbConnection");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const tagRoutes = require("./routes/tagRoutes");
const userRoutes = require("./routes/userRoutes");
const communityRoutes = require("./routes/communityRoutes");
const membershipRoutes = require("./routes/membershipRoutes");

// Configure multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Appends the original file extension
  },
});

const app = express();
const server = http.createServer(app);
const io = initializeSocketServer(server);
const port = process.env.PORT || 5000;

//Youtube api stuff
const YOUTUBE_API_KEY = process.env.GOOGLE_CLIENT_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3/videos";

//Open ai API stuff
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//////////OPEN AI FUNCTIONS/////////////////////////////////////////

// Summarize description
const descriptionSummarize = async (desc) => {
  console.log(desc);
  const prompt = `Summarize the following description of a youtube video within two sentences: ${desc}`;
  if (desc.length > 30) {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.7,
      });

      const completion_text = completion.data.choices[0];

      return completion_text;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  } else {
    return desc;
  }
};

const getInspired = async (inputedVideo, userTitles, userDescriptions) => {
  const prompt = `Here is a list of information about my previous videos: { titles: ${userTitles} }. Here is information about a video that I would like to draw inspiration from: { titles: ${inputedVideo.title} }. Using the stated information, generate an attractive title and a well thought out video idea in a paragraph`;
  console.log("Prompt: ", prompt);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 400,
    });

    const completion_text = completion.data.choices[0];

    return completion_text;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
};

////////////////////////////////////////////////////////////////////

// Generate a session secret and reuse it for all sessions
const sessionSecret = crypto.randomBytes(32).toString("hex");

// Create an Express session and pass it to the WebSocket server
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true,
});

app.use(cors());
app.use(express.json());
// Initialize passport
app.use(sessionMiddleware);
app.use(passportSetup.initialize());
app.use(passportSetup.session());
io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true, // Optional, to automatically save sessions to the store
  })
);

// Your authRoutes
app.use("/auth", authRoutes);

// Your apiRoutes
app.use("/api", apiRoutes);
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), (req, res) => {
  console.log("IMAGE RECEIVED");
  if (req.file) {
    res.json({
      imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
    });
  } else {
    res.status(400).json({ error: "There was an error uploading the image" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//Route Middlewares
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);
app.use("/tags", tagRoutes);
app.use("/users", userRoutes);
app.use("/communities", communityRoutes);
app.use("/membership", membershipRoutes);

// Serve the output.css file with the correct MIME type
app.get("/dist/output.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.resolve(__dirname, "dist", "output.css"));
});

// Get all users from user database
app.get("/users", (req, res) => {
  const query = "SELECT * FROM Users";

  con.query(query, (error, result) => {
    if (error) {
      console.log("Could not retrieve users from database. ", error);
      res.status(500).json({ error: "Failed to get users from the database" });
    } else {
      res.json(result);
    }
  });
});

process.on("SIGINT", () => {
  console.log("Closing MySQL connection...");
  con.end((err) => {
    if (err) {
      console.log("Error closing MySQL connection.", err);
    } else {
      console.log("MySQL connection closed.");
    }
    process.exit(0);
  });
});

// Inspiration Engine
// Desired input: titles, descriptions, and keywords from the following:
//    -users previous videos(cap of 10), inputed videos, and trending videos within the niche
// Ideal ouput: Title, Idea Summary, Keywords, and Similar Videos

//app.use("/inspirationengine", ieRoutes);

// This allows us to destructure req.body
app.use(express.json());

app.get("/my-video-details", async (req, res) => {
  try {
    res.json(videos);
  } catch (error) {
    console.error("Error fetching user video details: ", error);
    res.status(500).send("Failed to fetch user video details");
  }
});

app.get("/videoDetails", async (req, res) => {
  const videoId = req.query.videoId;
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: "snippet",
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });
    const videoDetails = response.data.items[0].snippet;
    res.json(videoDetails);
  } catch (error) {
    console.error("Error fetching video details:", error);
    res.status(500).send("Failed to fetch video details");
  }
});

app.post("/gpt-api-call", async (req, res) => {
  const { vidDetails, myVidDetails } = req.body;

  try {
    //console.log(req.body);
    //console.log(myVidDetails.description);

    // Get user vid titles and descritpions in an array
    const userTitles = [];
    const userDescriptions = [];
    for (let i = 0; i < myVidDetails.length; i++) {
      userTitles.push(myVidDetails[i].title);
      let newDesc = await descriptionSummarize(myVidDetails[i].description);
      userDescriptions.push(newDesc.text);
    }
    // Summarize description of inputted video
    //vidDetails.description = await descriptionSummarize(vidDetails.description).text;
    console.log(
      "descriptions: ",
      userDescriptions,
      "\nalso\n",
      vidDetails.description
    );
    const output = await getInspired(vidDetails, userTitles, userDescriptions);
    console.log("Output:", output.text);
    res.json(output.text);
  } catch (error) {}
});

let video = {
  title: "",
  description: "",
  keywords: [],
};

server.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});
