// UserProvider.js
import React, { useState, useEffect } from "react";
import UserContext from "../context/UserContext";

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("/api/user-id")
      .then((response) => response.json())
      .then((data) => setUserId(data.userId))
      .catch((error) => console.error("Error fetching userId:", error));
  }, []);

  return <UserContext.Provider value={userId}>{children}</UserContext.Provider>;
};

export default UserProvider;
