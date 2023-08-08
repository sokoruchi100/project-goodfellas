// TopBar.js
import React, { useContext } from "react";
import UserContext from "../context/UserContext";

const TopBar = () => {
  const user = useContext(UserContext);

  return (
    <div className="top-bar">
      <span>{user.displayName}</span>
      {user.profilePicture && (
        <img src={user.profilePicture} alt="User Profile" />
      )}
    </div>
  );
};

export default TopBar;
