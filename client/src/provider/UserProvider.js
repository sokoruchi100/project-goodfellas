// UserProvider.js
import React, { useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    displayName: null,
    profilePicture: null,
  });
  // Fetching user ID
  useEffect(() => {
    axios
      .get("/api/user-id")
      .then((response) => {
        const data = response.data;
        setUser((prev) => ({ ...prev, userId: data.userId }));
      })
      .catch((error) => console.error("Error fetching userId:", error));
  }, []); // Empty dependency array means this runs only once

  // Fetching user profile if userId is set
  useEffect(() => {
    if (user.userId) {
      axios
        .get(`/api/userprofile/${user.userId}`)
        .then((response) => {
          const data = response.data;
          setUser((prevState) => ({
            ...prevState, // Spread the previous state to keep the existing properties
            displayName: data.displayName,
            profilePicture: data.profilePicture,
          }));
        })
        .catch((error) => console.error("Error fetching user profile:", error));
    }
  }, [user.userId]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;
