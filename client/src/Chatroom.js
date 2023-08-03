import React, { useState } from "react";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "user" }]);
      setNewMessage("");
    }
  };

  // Simulate incoming messages from other users or a chat server
  // You can replace this with actual socket or server integration for real-time chat
  const simulateIncomingMessage = () => {
    setMessages([...messages, { text: "Hello!", sender: "otherUser" }]);
  };

  return (
    <div>
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
      <button onClick={simulateIncomingMessage}>
        Simulate Incoming Message
      </button>
    </div>
  );
};

export default Chatroom;
