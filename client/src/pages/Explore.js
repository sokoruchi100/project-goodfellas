import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "../components/Navbar";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuth } from "../context/AuthContext";
import UserContext from "../context/UserContext";
import TagBox from "../components/TagBox";
import Button from "../components/Button";
import TopBar from "../components/TopBar";
import { stringToArray } from "../utils/TagsUtil";
import CommunityCard from "../components/CommunityCard";
import CreateCommunityOverlay from "../components/CreateCommunityOverlay";

const Explore = () => {
  const { userId } = useContext(UserContext);
  const { isAuthenticated, handleAuthentication } = useAuth();

  // This line will automatically handle the authentication checks
  useAuthentication(isAuthenticated, handleAuthentication);

  // State to handle whether to show public or private communities
  const [showPublicCommunities, setShowPublicCommunities] = useState(true);
  const [allCommunities, setAllCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [searchTags, setSearchTags] = useState("");
  const [showCreateCommunityOverlay, setShowCreateCommunityOverlay] =
    useState(false);

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

  const handleSearchTagsChange = (e) => {
    setSearchTags(e.target.value);
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

  const handleShowCreateCommunityOverlay = (e) => {
    setShowCreateCommunityOverlay(true);
  };

  return (
    <div>
      <TopBar />
      <CreateCommunityOverlay
        userId={userId}
        setAllCommunities={setAllCommunities}
        showCreateCommunityOverlay={showCreateCommunityOverlay}
        setShowCreateCommunityOverlay={setShowCreateCommunityOverlay}
      ></CreateCommunityOverlay>
      <div className="flex flex-row">
        <Navbar
          className="w-1/12"
          handleAuthentication={handleAuthentication}
        />

        <div className="flex flex-col h-full w-2/12">
          <div className="mb-16">
            <Button
              text="Create Community"
              onClick={handleShowCreateCommunityOverlay}
            ></Button>
          </div>

          <div className="flex flex-col">
            <Button
              text="Explore"
              onClick={handleShowPublicCommunities}
            ></Button>
            <Button
              text="My Communities"
              onClick={handleShowPrivateCommunities}
            ></Button>
          </div>
        </div>

        <div className="flex flex-col w-9/12 h-full">
          <div className="h-1/4">
            <h2>Explore Communities</h2>
            <div>
              {/* Search Bar */}
              <TagBox value={searchTags} onChange={handleSearchTagsChange} />
              <Button text="Search Tags" onClick={handleSearch} />
            </div>
          </div>

          <div className="h-3/4 bg-black p-10">
            <div className="grid grid-cols-3 space-x-10">
              {/* Render the filtered communities */}
              {Array.isArray(filteredCommunities) &&
                filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    handleCommunityDeletion={handleCommunityDeletion}
                    userId={userId}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Explore;
