import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "./Navbar";
import { useAuthentication } from "./hooks/useAuthentication";
import { validateInputLength } from "./utils/validate";
import { useAuth } from "./context/AuthContext";
import UserContext from "./context/UserContext";
import TagBox from "./components/TagBox";
import Button from "./components/Button";
import TopBar from "./components/TopBar";
import ImageUpload from "./components/ImageUpload";
import {
  arrayToString,
  postCommunityTags,
  stringToArray,
} from "./utils/TagsUtil";

const Explore = () => {
  const { userId } = useContext(UserContext);
  const { isAuthenticated, handleAuthentication } = useAuth();

  // This line will automatically handle the authentication checks
  useAuthentication(isAuthenticated, handleAuthentication);

  // Use the useFetchData hook and get the communities and userId
  //const { communities, userId } = useFetchData();

  // State to handle whether to show public or private communities
  const [showPublicCommunities, setShowPublicCommunities] = useState(true);
  const [allCommunities, setAllCommunities] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Set the default value to true
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [tags, setTags] = useState("");
  const [searchTags, setSearchTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const getCommunities = async () => {
    try {
      const response = await axios.get("/communities");
      setAllCommunities(response.data);
    } catch (error) {
      console.error("Error fetching communities:", error);
    }
  };

  useEffect(() => {
    getCommunities();
  }, []); // Empty dependency array to run the effect only once

  // Function to toggle the state for showing public communities
  const handleShowPublicCommunities = () => {
    setShowPublicCommunities(true);
  };

  // Function to toggle the state for showing private communities
  const handleShowPrivateCommunities = () => {
    setShowPublicCommunities(false);
  };

  const filterIfPublicOrPrivate = useCallback(
    async (communities) => {
      const results = [];

      for (const community of communities) {
        if (showPublicCommunities && community.isPublic) {
          results.push(community); // Include the community object in the results
        } else if (!showPublicCommunities && !community.isPublic) {
          try {
            const response = await axios.get(
              `/membership/is-member/${community.roomCode}/${userId}`
            );
            if (response.data.isMember) {
              results.push(community); // Include the community object in the results
            }
          } catch (error) {
            console.error("Error fetching user membership:", error);
          }
        }
      }
      return results;
    },
    [showPublicCommunities, userId]
  );

  // Function to filter the communities based on public and private states
  useEffect(() => {
    filterIfPublicOrPrivate(allCommunities).then((results) => {
      setFilteredCommunities(results);
    });
  }, [allCommunities, filterIfPublicOrPrivate]);

  const handleSearch = () => {
    let communities = [];
    if (searchTags === "") {
      communities = allCommunities;
    } else {
      const searchTagsArray = stringToArray(searchTags);

      allCommunities.forEach((community) => {
        const allTagsPresent = searchTagsArray.every((tag) =>
          community.tags.includes(tag)
        );
        if (allTagsPresent) {
          communities.push(community);
        }
      });
    }

    filterIfPublicOrPrivate(communities).then((results) => {
      setFilteredCommunities(results);
    });
  };

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
      const result = await axios.post("/communities", {
        roomCode: roomCode,
        creatorId: userId,
        communityName: name,
        description: description,
        isPublic: isPublic,
        communityPicture: imageUrl,
      });

      await handleSubmitTags(result.data.communityId);

      // Refetch the communities
      const response = await axios.get("/communities");
      setAllCommunities(response.data);

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

  const handleSearchTagsChange = (e) => {
    setSearchTags(e.target.value);
  };

  const handleSubmitTags = async (communityId) => {
    await postCommunityTags(communityId, tags)
      .then((response) => {
        console.log("Tags successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating tags:", error);
      });
  };

  const handleCommunityDeletion = async (communityId) => {
    try {
      await axios.delete(`/communities/${communityId}`);

      // Handle successful deletion
      // Refetch the communities
      const communitiesResponse = await axios.get("/communities");
      setAllCommunities(communitiesResponse.data);
    } catch (error) {
      console.error("Error deleting or fetching communities:", error);
      // Provide feedback to the user that deletion or fetching failed
    }
  };

  return (
    <div>
      <TopBar />
      <Navbar handleAuthentication={handleAuthentication} />

      <div>
        <h1>Communities</h1>

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
              Profile Picture:
              <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
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

        <Button text="Explore" onClick={handleShowPublicCommunities}></Button>

        <Button
          text="My Communities"
          onClick={handleShowPrivateCommunities}
        ></Button>
      </div>

      <div>
        <div>
          {/* Search Bar */}
          <TagBox value={searchTags} onChange={handleSearchTagsChange} />
          <Button text="Search Tags" onClick={handleSearch} />
        </div>

        <ul>
          {/* Render the filtered communities */}
          {Array.isArray(filteredCommunities) &&
            filteredCommunities.map((community) => (
              <li key={community.id}>
                <Link to={`/communities/chatroom/${community.roomCode}`}>
                  <h2>{community.communityName}</h2>
                </Link>
                <img src={community.communityPicture} alt="" />
                <p>Tags: {arrayToString(community.tags)}</p>
                <p>{community.description}</p>
                {community.creatorId === userId && (
                  <Button
                    text="Delete Community"
                    onClick={() => handleCommunityDeletion(community.id)}
                  />
                )}
                <br />
              </li>
            ))}
        </ul>
      </div>

      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Explore;
