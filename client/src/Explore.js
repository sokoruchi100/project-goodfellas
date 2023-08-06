import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "./Navbar";
import { useAuthentication } from "./hooks/useAuthentication";
import { validateInputLength } from "./utils/validate";

const Explore = ({ isAuthenticated, handleAuthentication }) => {
  // This line will automatically handle the authentication checks
  useAuthentication(isAuthenticated, handleAuthentication);

  // Use the useFetchData hook and get the communities and userId
  //const { communities, userId } = useFetchData();

  // State to handle whether to show public or private communities
  const [showPublicCommunities, setShowPublicCommunities] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Set the default value to true
  const [userId, setUserId] = useState(0);
  const [filteredCommunities, setFilteredCommunities] = useState([]);

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

  // Function to toggle the state for showing public communities
  const handleShowPublicCommunities = () => {
    setShowPublicCommunities(true);
  };

  // Function to toggle the state for showing private communities
  const handleShowPrivateCommunities = () => {
    setShowPublicCommunities(false);
  };

  // Function to filter the communities based on public and private states
  useEffect(() => {
    const fetchFilteredCommunities = async () => {
      const results = [];

      for (const community of communities) {
        if (showPublicCommunities && community.isPublic) {
          results.push(community); // Include the community object in the results
        } else if (!showPublicCommunities && !community.isPublic) {
          try {
            const response = await axios.get("/api/is-user-member", {
              params: { roomCode: community.roomCode, userId },
            });
            if (response.data.isMember) {
              results.push(community); // Include the community object in the results
            }
          } catch (error) {
            console.error("Error fetching user membership:", error);
          }
        }
      }
      setFilteredCommunities(results);
    };

    fetchFilteredCommunities();
  }, [communities, showPublicCommunities, userId]);

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

  const handleCreateChatroom = async () => {
    //Performs checks
    if (
      !validateInputLength(name, 1, 50) ||
      !validateInputLength(description, 1, 200)
    ) {
      return;
    }

    // Function to handle the creation of a new chatroom
    const roomCode = generateRoomCode();

    // Make an API call to store the new chatroom in the database
    try {
      await axios.post("/api/create-community", {
        roomCode,
        creatorId: userId,
        communityName: name,
        description,
        isPublic,
      });

      // Refetch the communities
      const response = await axios.get("/api/communities");
      setCommunities(response.data);

      // Clear the form fields
      setName("");
      setDescription("");
      setIsPublic(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Navbar handleAuthentication={handleAuthentication} />
      <h1>Communities</h1>
      {/* Toggle button to show public communities */}
      <button onClick={handleShowPublicCommunities}>Explore</button>
      {/* Toggle button to show private communities */}
      <button onClick={handleShowPrivateCommunities}>My Communities</button>
      <ul>
        {/* Render the filtered communities */}
        {console.log(
          "Filtered Communities:",
          filteredCommunities.map((c) => c.id)
        )}
        {filteredCommunities.map((community) => (
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
