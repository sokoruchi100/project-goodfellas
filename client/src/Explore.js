import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Explore = () => {
  const [communities, setCommunities] = useState([]);

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
      <Navbar />
      <h1>Explore Communities</h1>
      <ul>
        {communities.map((community) => (
          <li key={community.id}>
            <h2>{community.communityName}</h2>
            <p>{community.description}</p>
            <p>{community.isPublic ? "Public" : "Private"}</p>
            <p>Room Code: {community.roomCode}</p>
            <p>Creator ID: {community.creatorId}</p>
            <p>Date of Creation: {community.dateOfCreation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Explore;
