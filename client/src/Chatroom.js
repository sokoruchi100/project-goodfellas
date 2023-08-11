import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom"; // Import useParams to get the community ID from the URL
import Navbar from "./Navbar";
import axios from "axios";
import socket from "./socket-client";
import AddUserComponent from "./AddUserComponent";
import { useAuth } from "./context/AuthContext";
import UserContext from "./context/UserContext";
import TopBar from "./components/TopBar";

const Chatroom = () => {
  const { userId, displayName, profilePicture } = useContext(UserContext);
  const { isAuthenticated, handleAuthentication } = useAuth();
  const navigate = useNavigate();
  const { roomCode } = useParams(); // Get the roomCode from the URL parameter

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isRoomPrivate, setIsRoomPrivate] = useState(false);

  const memoizedHandleAuthentication = useCallback(handleAuthentication, [
    handleAuthentication,
  ]);

  useEffect(() => {
    //WE ESCAPED CALLBACK HELL!!!
    const fetchUserDataAndRoomInfo = async () => {
      try {
        // Check membership
        const isMemberResponse = await axios.get(
          `/membership/is-member/${roomCode}/${userId}`
        );
        const memberStatus = isMemberResponse.data.isMember;

        if (memberStatus) {
          const ownerResponse = await axios.get(
            `/communities/is-owner/${roomCode}/${userId}`
          );
          setIsOwner(ownerResponse.data.isOwner);
        }

        // Check room's privacy
        const roomPrivateResponse = await axios.get(
          `/communities/is-private/${roomCode}`
        );
        const roomPrivacy = roomPrivateResponse.data.isPrivate;
        setIsRoomPrivate(roomPrivacy);

        if (!memberStatus && roomPrivacy) {
          navigate("/communities/explore");
        } else if (!memberStatus && !roomPrivacy) {
          try {
            await axios.post("/membership", {
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
  }, [navigate, roomCode, userId]);

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/auth/ensure", { withCredentials: true })
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
    socket.on("new-message", ({ displayName, profilePicture, content }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          displayName: displayName,
          profilePicture: profilePicture,
          content: content,
          timeStamp: new Date(),
        },
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
        displayName: displayName,
        profilePicture: profilePicture,
        content: newMessage,
      };
      //If new message isn't blank, add it to messages
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          displayName: displayName,
          profilePicture: profilePicture,
          content: newMessage,
          timeStamp: new Date(),
        },
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
      <TopBar />
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
            <div key={index} className={`message`}>
              <span>{message.displayName}</span>
              {message.profilePicture && (
                <img src={message.profilePicture} alt="User Profile" />
              )}
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
