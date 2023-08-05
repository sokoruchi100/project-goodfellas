const socketIO = require("socket.io");
const {
  saveMessageToDatabase,
  loadAndSendMessages,
} = require("./database/messageQueries");
const { getCommunityIdByRoomCode } = require("./database/communityQueries");

const EVENTS = {
  CONNECTION: "connection",
  JOIN_COMMUNITY: "join-community",
  LEAVE_COMMUNITY: "leave-community",
  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",
  LOAD_MESSAGES: "load-messages",
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
    socket.on(EVENTS.JOIN_COMMUNITY, (roomCode) => {
      console.log("A user joined a community:", roomCode);
      // Implement room joining logic here based on the "message" parameter
      socket.join(roomCode);
      //Perform query to geet communityId from communities using roomCode
      const communityId = getCommunityIdByRoomCode(roomCode);
      loadAndSendMessages(communityId, (messages) => {
        socket.emit(EVENTS.LOAD_MESSAGES, messages);
      });
    });

    // Handle "send-message" event
    socket.on(EVENTS.SEND_MESSAGE, async ({ room, message }) => {
      console.log("Received message:", message);
      //Perform query to geet communityId from communities using roomCode
      const communityId = getCommunityIdByRoomCode(roomCode);
      // Save the message to the database
      await saveMessageToDatabase(communityId, message);
      // Broadcast the message to all clients in the room
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
