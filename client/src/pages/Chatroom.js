import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom"; // Import useParams to get the community ID from the URL
import Navbar from "../components/Navbar";
import axios from "axios";
import socket from "../socket-client";
import AddUserComponent from "../components/AddUserComponent";
import { useAuth } from "../context/AuthContext";
import UserContext from "../context/UserContext";
import TopBar from "../components/TopBar";
import MessagesList from "../components/MessagesList";

const Chatroom = () => {
  const { userId, displayName, profilePicture } = useContext(UserContext);
  const { isAuthenticated, handleAuthentication } = useAuth();
  const navigate = useNavigate();
  const { roomCode } = useParams(); // Get the roomCode from the URL parameter

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isRoomPrivate, setIsRoomPrivate] = useState(false);

  const memoizedHandleAuthentication = useCallback(handleAuthentication, [
    handleAuthentication,
  ]);

  useEffect(() => {
    //WE ESCAPED CALLBACK HELL!!!
    const fetchUserDataAndRoomInfo = async () => {
      try {
        //Get Community Name
        const communityNameResponse = await axios.get(
          `/communities/name/${roomCode}`
        );
        console.log(communityNameResponse.data.communityName);
        setCommunityName(communityNameResponse.data.communityName);

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
    <div className="h-screen">
      <TopBar />
      <Navbar />

      <div className="chatroom ml-24 flex flex-row h-full">
        <div className="bg-gray-800 h-full w-2/12 p-4">
          {communityName && <h2 className="text-3xl mb-10">{communityName}</h2>}
          {isOwner && isRoomPrivate && <AddUserComponent></AddUserComponent>}
        </div>

        <div className="w-10/12 relative h-full">
          {messages && <MessagesList messages={messages}></MessagesList>}
          <form
            onSubmit={handleSendMessage}
            className="w-full bg-black h-1/6 absolute flex items-center px-6"
          >
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Send a message"
              className="w-full py-4 px-3 rounded-xl text-lg font-semibold"
            />
            <button type="submit" className="absolute right-4 border-none">
              Send
            </button>
          </form>
        </div>
      </div>

      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Chatroom;
