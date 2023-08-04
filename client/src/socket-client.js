import { io } from "socket.io-client";
const SERVER_URL = "http://localhost:5000";

const socket = io(SERVER_URL, {
  reconnectionAttempts: 3, // Number of reconnection attempts
});

socket.on("connect", () => {
  console.log("Connected to server:", SERVER_URL);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("Attempting reconnection:", attemptNumber);
});
export default socket;
