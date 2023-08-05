const socketIO = require("socket.io");

const EVENTS = {
  CONNECTION: "connection",
  JOIN_COMMUNITY: "join-community",
  LEAVE_COMMUNITY: "leave-community",
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  DISCONNECT: "disconnect",
};

function initializeSocketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  io.on(EVENTS.CONNECTION, (socket) => {
    console.log("A user connected:", socket.id);

    // Handle WebSocket events here
    socket.on(EVENTS.JOIN_COMMUNITY, (message) => {
      console.log("A user joined a community:", message);
      // Implement room joining logic here based on the "message" parameter
      const room = message.room; // Assuming the message contains a "room" property
      socket.join(room);
    });

    // Handle "send-message" event
    socket.on(EVENTS.SEND_MESSAGE, (message) => {
      console.log("Received message:", message);
      // Broadcast the message to all clients in the room
      const room = message.room; // Assuming the message contains a "room" property
      socket.to(room).emit(EVENTS.NEW_MESSAGE, message);
    });

    socket.on(EVENTS.DISCONNECT, () => {
      console.log("A user disconnected:", socket.id);
      // Handle user disconnection here
    });
  });

  return io;
}

module.exports = initializeSocketServer;
