import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the community ID from the URL
import Navbar from "./Navbar";
import socket from "./socket-client";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { roomCode } = useParams(); // Get the roomCode from the URL parameter

  useEffect(() => {
    // Emit the "join-community" event
    socket.emit("join-community", roomCode);

    // Handle incoming messages from the server
    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: 0, content: message, timeStamp: new Date() },
      ]);
    });

    socket.on("load-messages", (messages) => {
      setMessages(messages);
    });

    // Scroll to the bottom whenever messages update
    scrollToBottom();

    // Cleanup the socket connection when the component unmounts
    return () => {
      // Remove the "new-message" event listener when the component unmounts
      socket.off("new-message");
    };
  }, [roomCode]); // Include roomCode in the dependency array

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = (event) => {
    event.preventDefault(); // Prevent form submission
    if (newMessage.trim() !== "") {
      //If new message isn't blank, add it to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: 1, content: newMessage, timeStamp: new Date() },
      ]);
      // Emit the "send-message" event to the server with the new message
      socket.emit("send-message", { room: roomCode, message: newMessage });
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    const chatroom = document.querySelector(".chatroom");
    chatroom.scrollTop = chatroom.scrollHeight;
  };

  return (
    <div>
      <Navbar />
      <div className="chatroom">
        <h1>Chatroom {roomCode}</h1>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chatroom;
