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

let communityUserCounts = {}; // Example: {"roomCode1": 3, "roomCode2": 5}

function initializeSocketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:3000"],
    },
  });

  io.on(EVENTS.CONNECTION, (socket) => {
    // Handle WebSocket events here
    socket.on(EVENTS.JOIN_COMMUNITY, async (roomCode) => {
      // Implement room joining logic here based on the "message" parameter
      socket.join(roomCode);

      if (!communityUserCounts[roomCode]) {
        communityUserCounts[roomCode] = 0;
      }
      communityUserCounts[roomCode]++;
      io.to(roomCode).emit("update-user-count", communityUserCounts[roomCode]);
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
    socket.on(
      EVENTS.SEND_MESSAGE,
      async ({ roomCode, senderId, displayName, profilePicture, content }) => {
        //Perform query to geet communityId from communities using roomCode
        const communityId = await getCommunityIdByRoomCode(roomCode);
        // Save the message to the database
        await saveMessageToDatabase(communityId, { senderId, content });
        // Broadcast the message to all clients in the room
        socket
          .to(roomCode)
          .emit(EVENTS.NEW_MESSAGE, { displayName, profilePicture, content });
      }
    );

    // Handle "send-message" event
    socket.on(EVENTS.LEAVE_COMMUNITY, (roomCode) => {
      if (communityUserCounts[roomCode]) {
        communityUserCounts[roomCode]--;
        io.to(roomCode).emit(
          "update-user-count",
          communityUserCounts[roomCode]
        );
      }
    });

    socket.on(EVENTS.DISCONNECT, () => {
      // Handle user disconnection here
    });
  });

  return io;
}

module.exports = initializeSocketServer;
