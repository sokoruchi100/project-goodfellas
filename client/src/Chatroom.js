import React, { useState, useEffect, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom"; // Import useParams to get the community ID from the URL
import Navbar from "./Navbar";
import axios from "axios";
import socket from "./socket-client";
import AddUserComponent from "./AddUserComponent";

const Chatroom = ({ isAuthenticated, handleAuthentication }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isRoomPrivate, setIsRoomPrivate] = useState(false);

  const { roomCode } = useParams(); // Get the roomCode from the URL parameter

  const memoizedHandleAuthentication = useCallback(handleAuthentication, [
    handleAuthentication,
  ]);

  useEffect(() => {
    //WE ESCAPED CALLBACK HELL!!!
    const fetchUserDataAndRoomInfo = async () => {
      try {
        // Fetch user ID
        const response = await axios.get("/api/user-id", {
          withCredentials: true,
        });
        const userId = response.data.userId;
        setUserId(userId);

        // Check membership
        const hasJoinedResponse = await axios.get(
          `/api/has-joined/${roomCode}/${userId}`
        );
        const memberStatus = hasJoinedResponse.data.hasJoined;

        if (memberStatus) {
          const ownerResponse = await axios.get(
            `/api/is-owner/${roomCode}/${userId}`
          );
          setIsOwner(ownerResponse.data.isOwner);
        }

        // Check room's privacy
        const roomPrivateResponse = await axios.get(
          `/api/is-private/${roomCode}`
        );
        const roomPrivacy = roomPrivateResponse.data.isPrivate;
        setIsRoomPrivate(roomPrivacy);

        if (!memberStatus && roomPrivacy) {
          navigate("/communities/explore");
        } else if (!memberStatus && !roomPrivacy) {
          try {
            await axios.post("/api/add-to-membership", {
              userId: userId,
              roomCode: roomCode,
            });
          } catch (error) {
            console.error("Error joining community:", error);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserDataAndRoomInfo();
  }, [navigate, roomCode]);

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

    socket.on("users-in-room", (users) => {
      setUsersInRoom(users);
    });

    // Scroll to the bottom whenever messages update
    scrollToBottom();

    // Cleanup the socket connection when the component unmounts
    return () => {
      // cleans up when unmounting, aka leaving the community
      socket.emit("leave-community", roomCode);
      socket.off("new-message");
      socket.off("users-in-room");
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
        <div className="users">
          {usersInRoom.map((user) => (
            <span key={user.id}>{user.name}</span>
          ))}
        </div>
        {console.log("Is Owner:", isOwner)}
        {console.log("Is Room Private:", isRoomPrivate)}
        {isOwner && isRoomPrivate && <AddUserComponent></AddUserComponent>}
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
