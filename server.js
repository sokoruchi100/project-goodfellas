const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const passportSetup = require("./passport-setup"); // Import the passport setup file
const { fetchChannelIdAndVideoTitles } = require("./youtube-api"); // Import the YouTube API functions

const app = express();
const port = process.env.PORT || 5000;

// Generate a session secret and reuse it for all sessions
const sessionSecret = crypto.randomBytes(32).toString("hex");

// Initialize passport
app.use(
  session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passportSetup.initialize());
app.use(passportSetup.session());

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
      const { channelId, videoTitles } = await fetchChannelIdAndVideoTitles(
        req.user.tokens.access_token
      );

      // Currently stored in the session, but will be stored in the database for future use
      req.session.channelId = channelId;
      req.session.videoTitles = videoTitles;

      res.redirect("http://localhost:3000/dashboard"); // Redirect to the dashboard page after fetching the channel ID
    } catch (error) {
      console.error("Error fetching channel ID:", error.message);
      res.status(500).send("Error fetching channel ID. Please try again.");
    }
  }
);

// Endpoint to get all video titles from the user's YouTube channel
app.get("/api/videos", ensureAuthenticated, async (req, res) => {
  try {
    res.json(req.session.videoTitles); // Send the video titles as a JSON response
  } catch (error) {
    console.error("Error fetching video titles:", error.message);
    res.status(500).json({ error: "Error fetching video titles" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
