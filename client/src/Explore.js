import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "./Navbar";
import { useAuthentication } from "./hooks/useAuthentication";
import { validateInputLength } from "./utils/validate";
import { useAuth } from "./context/AuthContext";
import UserContext from "./context/UserContext";
import TagBox from "./components/TagBox";
import Button from "./components/Button";
import { arrayToString, postCommunityTags, getTags } from "./utils/TagsUtil";

const Explore = () => {
  const userId = useContext(UserContext);
  const { isAuthenticated, handleAuthentication } = useAuth();
  const [tags, setTags] = useState("");
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
  const [filteredCommunities, setFilteredCommunities] = useState([]);

  useEffect(() => {
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

  const handleCreateChatroom = async (e) => {
    e.preventDefault();
    //Performs checks
    if (
      !validateInputLength(name, 1, 50) ||
      !validateInputLength(description, 1, 200) ||
      !validateInputLength(tags, 1, 255)
    ) {
      return;
    }

    // Function to handle the creation of a new chatroom
    const roomCode = generateRoomCode();

    // Make an API call to store the new chatroom in the database
    try {
      const result = await axios.post("/api/create-community", {
        roomCode,
        creatorId: userId,
        communityName: name,
        description,
        isPublic,
      });

      console.log(result);

      await handleSubmitTags(result.data.communityId);

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

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmitTags = async (communityId) => {
    console.log(tags);
    await postCommunityTags(communityId, tags)
      .then((response) => {
        console.log("Tags successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating tags:", error);
      });
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
            <p>Tags: {community.tags}</p>
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
          <TagBox value={tags} onChange={handleTagsChange} />
          <Button
            text="Create Chatroom"
            onClick={(e) => handleCreateChatroom(e)}
          />
        </form>
      </div>
      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Explore;
