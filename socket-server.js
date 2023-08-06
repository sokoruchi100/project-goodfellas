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
    socket.on(EVENTS.JOIN_COMMUNITY, async (roomCode) => {
      console.log("A user joined a community:", roomCode);
      // Implement room joining logic here based on the "message" parameter
      socket.join(roomCode);
      //Perform query to get communityId from communities using roomCode
      const communityId = await getCommunityIdByRoomCode(roomCode);
      if (communityId !== null) {
        try {
          const messages = await loadAndSendMessages(communityId); // Use await here
          socket.emit(EVENTS.LOAD_MESSAGES, messages);
        } catch (error) {
          console.error("Error loading and sending messages:", error);
        }
      }
    });

    // Handle "send-message" event
    socket.on(EVENTS.SEND_MESSAGE, async ({ roomCode, senderId, content }) => {
      console.log("Received message:", content);
      //Perform query to geet communityId from communities using roomCode
      const communityId = await getCommunityIdByRoomCode(roomCode);
      console.log("WELCOME TO COMMUNITY NUMBER: " + communityId);
      // Save the message to the database
      await saveMessageToDatabase(communityId, { senderId, content });
      // Broadcast the message to all clients in the room
      socket.to(roomCode).emit(EVENTS.NEW_MESSAGE, { senderId, content });
    });

    socket.on(EVENTS.DISCONNECT, () => {
      console.log("A user disconnected:", socket.id);
      // Handle user disconnection here
    });
  });

  return io;
}

module.exports = initializeSocketServer;
