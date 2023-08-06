import React, { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom"; // Import useParams to get the community ID from the URL
import Navbar from "./Navbar";
import axios from "axios";
import socket from "./socket-client";

const Chatroom = ({ isAuthenticated, handleAuthentication }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(0);
  const { roomCode } = useParams(); // Get the roomCode from the URL parameter

  const memoizedHandleAuthentication = useCallback(handleAuthentication, [
    handleAuthentication,
  ]);

  useEffect(() => {
    // Make an API call to get the user's ID
    axios
      .get("/api/user-id", { withCredentials: true })
      .then((response) => {
        const userId = response.data.userId;
        setUserId(userId);
        axios.get(`/api/has-joined/${roomCode}/${userId}`).then((res) => {
          if (res.data.hasJoined) {
            // User is already a member
            return;
          } else {
            // User is not a member. Check if the community is private
            axios.get(`/api/is-private/${roomCode}`).then((res) => {
              if (res.data.isPrivate) {
                // Redirect user to the explore page
                navigate("/communities/explore");
              } else {
                // Add user to the membership table as it's a public community
                axios
                  .post("/api/add-to-membership", {
                    userId: userId,
                    roomCode: roomCode,
                  })
                  .catch((error) => {
                    console.error("Error joining community:", error);
                  });
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/api/ensure-auth", { withCredentials: true })
      .then((response) => {
        memoizedHandleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [memoizedHandleAuthentication, isAuthenticated]);

  useEffect(() => {
    // Emit the "join-community" event
    socket.emit("join-community", roomCode);

    // Handle incoming messages from the server
    socket.on("new-message", ({ senderId, content }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: senderId, content: content, timeStamp: new Date() },
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
    if (newMessage.trim() !== "" && userId !== null) {
      const messageData = {
        roomCode: roomCode,
        senderId: userId,
        content: newMessage,
      };
      //If new message isn't blank, add it to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: userId, content: newMessage, timeStamp: new Date() },
      ]);
      // Emit the "send-message" event to the server with the new message
      socket.emit("send-message", messageData);
      setNewMessage("");
    }
  };

  const scrollToBottom = () => {
    const chatroom = document.querySelector(".chatroom");
    chatroom.scrollTop = chatroom.scrollHeight;
  };

  return (
    <div>
      <Navbar handleAuthentication={handleAuthentication} />
      <div className="chatroom">
        <h1>Chatroom {roomCode}</h1>
        {messages &&
          messages.map((message, index) => (
            <div key={index} className={`message ${message.senderId}`}>
              {message.senderId}
              {message.content}
              {message.timeStamp.toLocaleString()}
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
      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Chatroom;
