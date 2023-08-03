const socketIO = require("socket.io");

function initializeSocketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle WebSocket events here
    socket.on("join-room", (message) => {
      console.log("A user joined a room:", message);
      // Handle room joining logic here
    });

    // Handle "send-message" event
    socket.on("send-message", (message) => {
      console.log("Received message:", message);
      // Broadcast the message to all clients in the room
      socket.to("public-room").emit("new-message", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
      // Handle user disconnection here
    });
  });

  return io;
}

module.exports = initializeSocketServer;
