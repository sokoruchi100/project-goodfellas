//Modules
const http = require("http");
const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const sharedSession = require("express-socket.io-session");
const cors = require("cors");
const path = require("path");

//Files
const passportSetup = require("./passport-setup"); // Import the passport setup file
const initializeSocketServer = require("./socket-server");
const con = require("./database/dbConnection");

//Routes
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const ieRoutes = require("./routes/ieRoutes");
const tagRoutes = require("./routes/tagRoutes");

const app = express();
const server = http.createServer(app);
const io = initializeSocketServer(server);
const port = process.env.PORT || 5000;

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

// authRoutes
app.use("/auth", authRoutes);

// apiRoutes
app.use("/api", apiRoutes);

//ieRoutes
app.use("/inspiration-engine", ieRoutes);

//tagRoutes
app.use("/tags", tagRoutes);

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

server.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});
