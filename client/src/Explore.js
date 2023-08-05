import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom"; // Import Link from react-router-dom
import Navbar from "./Navbar";

const Explore = ({ isAuthenticated, handleAuthentication }) => {
  const [communities, setCommunities] = useState([]);

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
  }, [isAuthenticated]);

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

  return (
    <div>
      <Navbar handleAuthentication={handleAuthentication} />
      <h1>Explore Communities</h1>
      <ul>
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
      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
};

export default Explore;
