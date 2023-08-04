import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import socket from "./socket-client";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Emit the "join-room" event
    socket.emit("join-room", "public-room");

    // Handle incoming messages from the server
    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "server" },
      ]);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      // Emit the "send-message" event to the server with the new message
      socket.emit("send-message", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="chatroom">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatroom;
