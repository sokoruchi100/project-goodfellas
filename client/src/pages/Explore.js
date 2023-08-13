import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "../components/Navbar";
import { useAuthentication } from "../hooks/useAuthentication";
import { useAuth } from "../context/AuthContext";
import UserContext from "../context/UserContext";
import Button from "../components/Button";
import TopBar from "../components/TopBar";
import CommunityCard from "../components/CommunityCard";
import CreateCommunityOverlay from "../components/CreateCommunityOverlay";
import SearchBar from "../components/SearchBar";
import { stringToArray } from "../utils/TagsUtil";

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

  // Function to filter the communities based on public and private states
  useEffect(() => {
    filterIfPublicOrPrivate(allCommunities).then((results) => {
      setFilteredCommunities(results);
    });
  }, [allCommunities, filterIfPublicOrPrivate]);

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
    <div className="h-screen">
      <TopBar />
      <CreateCommunityOverlay
        userId={userId}
        setAllCommunities={setAllCommunities}
        showCreateCommunityOverlay={showCreateCommunityOverlay}
        setShowCreateCommunityOverlay={setShowCreateCommunityOverlay}
      ></CreateCommunityOverlay>
      <Navbar className="w-1/12" handleAuthentication={handleAuthentication} />

      <div className="ml-24 flex flex-row h-full">
        {/*SIDE BAR*/}
        <div className="flex items-center flex-col h-full w-2/12 bg-gray-900">
          <div className="mb-16 flex justify-center w-5/6 mt-16">
            <button
              className="font-normal text-white h-12 w-full text-3xl p-0 rounded-xl"
              onClick={handleShowCreateCommunityOverlay}
            >
              + Create
            </button>
          </div>

          <div className="flex flex-col w-5/6 justify-center">
            <button
              className="font-normal text-white bg-transparent mb-6"
              onClick={handleShowPublicCommunities}
            >
              Explore
            </button>
            <button
              className="font-normal text-white bg-transparent"
              text="My Communities"
              onClick={handleShowPrivateCommunities}
            >
              My Communities
            </button>
          </div>
        </div>

        <div className="flex flex-col w-10/12 h-full">
          {/*HEADER*/}
          <div className="h-1/4 pl-10 pt-10">
            <h2 className="text-4xl font-normal my-10">Explore Communities</h2>
            {/* Search Bar */}
            <SearchBar
              searchTags={searchTags}
              setSearchTags={setSearchTags}
              handleSearch={handleSearch}
            />
          </div>

          {/*MAIN BODY CONTENT*/}
          <div className="h-3/4 bg-black p-10">
            <div className="grid grid-cols-3 space-x-10 h-full">
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
