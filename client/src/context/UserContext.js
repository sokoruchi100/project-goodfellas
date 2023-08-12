// UserContext.js
import React from "react";

const UserContext = React.createContext({
  userId: null,
  displayName: null,
  profilePicture: null,
});

export default UserContext;
