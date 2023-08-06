import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "./Navbar";

const Explore = ({ isAuthenticated, handleAuthentication }) => {
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Set the default value to true
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    console.log("isAuthenticated has changed to: " + isAuthenticated);
    // Make an API call to check if the user is authenticated
    axios
      .get("/api/ensure-auth", { withCredentials: true })
      .then((response) => {
        handleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [isAuthenticated, handleAuthentication]);

  useEffect(() => {
    //Gets User Id
    axios
      .get("/api/user-id", { withCredentials: true })
      .then((response) => {
        const userId = response.data.userId;
        setUserId(userId);
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });

    // Fetch data from the backend API for communities
    axios
      .get("/api/communities")
      .then((response) => {
        setCommunities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching communities:", error);
      });
  }, []); // Empty dependency array to run the effect only once

  const generateRoomCode = () => {
    const roomCodeLength = 25;
    // Function to generate a random roomCode
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let roomCode = "";
    for (let i = 0; i < roomCodeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters.charAt(randomIndex);
    }
    return roomCode;
  };

  const handleCreateChatroom = () => {
    // Validate community name and description
    if (name.length < 1 || name.length > 50) {
      alert("Name must have between 1 and 50 characters.");
      return;
    }
    if (description.length < 1 || description.length > 200) {
      alert("Description must have between 1 and 200 characters.");
      return;
    }

    // Function to handle the creation of a new chatroom
    const roomCode = generateRoomCode();

    // Make an API call to store the new chatroom in the database
    axios
      .post("/api/create-community", {
        roomCode,
        creatorId: userId,
        communityName: name,
        description,
        isPublic,
      })
      .then((response) => {
        // After successful creation, update the communities state with the new chatroom
        axios
          .get("/api/communities")
          .then((response) => {
            setCommunities(response.data);
          })
          .catch((error) => {
            console.error("Error fetching communities:", error);
          });
        // Clear the form fields
        setName("");
        setDescription("");
        setIsPublic(true);
      })
      .catch((error) => {
        console.error("Error creating chatroom:", error);
      });
  };

  return (
    <div>
      <Navbar handleAuthentication={handleAuthentication} />
      <h1>Explore Communities</h1>
      <ul>
        {console.log(communities)}
        {communities.map((community) => (
          <li key={community.id}>
            <Link to={`/communities/chatroom/${community.roomCode}`}>
              <h2>{community.communityName}</h2>
            </Link>
            <p>{community.description}</p>
            <p>{community.isPublic ? "Public" : "Private"}</p>
            <p>Room Code: {community.roomCode}</p>
            <p>Creator ID: {community.creatorId}</p>
            <p>Date of Creation: {community.dateOfCreation}</p>
          </li>
        ))}
      </ul>
      <div>
        <h2>Create a New Chatroom</h2>
        <form>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label>
            Public:
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </label>
          <button type="button" onClick={handleCreateChatroom}>
            Create Chatroom
          </button>
        </form>
      </div>
      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Explore;
