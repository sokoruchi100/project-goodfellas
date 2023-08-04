const http = require("http");
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const passportSetup = require("./passport-setup"); // Import the passport setup file
const { fetchChannelIdAndVideoTitles } = require("./youtube-api"); // Import the YouTube API functions
const initializeSocketServer = require("./socket-server");
const sharedSession = require("express-socket.io-session");
const cors = require("cors");
const mysql = require("mysql");
const { channel } = require("diagnostics_channel");

const app = express();
const server = http.createServer(app);
const io = initializeSocketServer(server);
const port = process.env.PORT || 5000;

app.use(cors());

//When setting up MySQL use the below information
const con = mysql.createConnection({
  host: "34.27.144.22",
  user: "root",
  password: "%%56Hu3#PB:zdy%D",
  database: "ti_workshop_bashir",
  port: 3306,
});
con.connect((error) => {
  if (error) {
    console.log("Failed to connect to Database", error);
  } else {
    console.log("Connected to Database");
  }
});

// Generate a session secret and reuse it for all sessions
const sessionSecret = crypto.randomBytes(32).toString("hex");

// Create an Express session and pass it to the WebSocket server
const sessionMiddleware = session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true,
});

// Initialize passport
app.use(sessionMiddleware);
app.use(passportSetup.initialize());
app.use(passportSetup.session());
io.use(
  sharedSession(sessionMiddleware, {
    autoSave: true, // Optional, to automatically save sessions to the store
  })
);

// Middleware to check if the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    console.error("User is not authenticated.");
    return res.status(401).send("User is not authenticated.");
  }
};

// Endpoint to initiate the Google OAuth flow
app.get(
  "/auth/google",
  passportSetup.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
    ],
  })
);

// Endpoint to handle the Google OAuth callback
app.get(
  "/auth/google/callback",
  passportSetup.authenticate("google", { failureRedirect: "/login-failed" }),
  async (req, res) => {
    try {
      const { channelId, channelName, videoTitles } =
        await fetchChannelIdAndVideoTitles(req.user.tokens.access_token);

      // Currently stored in the session, but will be stored in the database for future use
      req.session.channelId = channelId;
      req.session.channelName = channelName;
      req.session.videoTitles = videoTitles;

      //Firstly check if channel id previously exists in our database
      //If not add the channelId and channelName to our database
      const querySearchForID = "SELECT * FROM Users WHERE channelId=?";
      con.query(querySearchForID, [channelId], (error, result) => {
        if (error) {
          console.log("Database error", error);
          res.status(500).json({ error: "Database error" });
        } else if (result.length == 0) {
          addUser(channelId, channelName);
          console.log("Added user: ", channelName);
        } else {
          console.log("User already exists in our database");
        }
      });
      res.redirect("http://localhost:3000/dashboard");
    } catch (error) {
      // Redirect to the dashboard page after fetching the channel ID
      console.error("Error fetching channel ID:", error.message);
      res.status(500).send("Error fetching channel ID. Please try again.");
    }
  }
);

function addUser(id, username) {
  //For the date coloumn
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let currentDate = `${year}-${month}-${day}`;

  const query =
    "INSERT INTO Users (id, channelId, channelName, dateOfCreation) VALUES (NULL, ?, ?, ?)";
  const values = [id, username, currentDate];

  con.query(query, values, (error, result) => {
    if (error) {
      console.log("Failed to add user", error);
      res.status(500).json({ error: "Failed to add user" });
    } else {
      console.log("Added User", username);
    }
  });
}

// Endpoint to get all video titles from the user's YouTube channel
app.get("/api/videos", ensureAuthenticated, async (req, res) => {
  try {
    res.json(req.session.videoTitles); // Send the video titles as a JSON response
  } catch (error) {
    console.error("Error fetching video titles:", error.message);
    res.status(500).json({ error: "Error fetching video titles" });
  }
});

// Get all users from user database
app.get("/users", (req, res) => {
  const query = "SELECT * FROM Users";

  con.query(query, (error, result) => {
    if (error) {
      console.log("Could not retrieve users from database. ", error);
      res.status(500).json(error, "Failed to get users from database");
    } else {
      res.json(result);
    }
  });
});

// Get all users from user database
app.get("/users", (req, res) => {
  const query = "SELECT * FROM Users";

  con.query(query, (error, result) => {
    if (error) {
      console.log("Could not retrieve users from database. ", error);
      res.status(500).json(error, "Failed to get users from database");
    } else {
      res.json(result);
    }
  });
});

server.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});
