// TopBar.js
import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation
import { useAuth } from "../context/AuthContext";

const TopBar = () => {
  const { handleAuthentication } = useAuth();
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const handleLogout = () => {
    // Make an API call to logout
    axios
      .post("/auth/logout", { withCredentials: true })
      .then(() => {
        // On successful logout, navigate to the landing page
        handleAuthentication(false);
        navigate("/"); // Redirect to the landing page
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  return (
    <div className="z-10 top-bar right-0 absolute flex flex-row pt-4 pr-8">
      <button
        className="hover:bg-yellow-200 hover:text-black mr-4 px-2 py-1 self-center text-white text-xl"
        onClick={handleLogout}
      >
        Log out
      </button>
      {user.profilePicture && (
        <img
          src={user.profilePicture}
          alt="User Profile"
          className="rounded-full w-16 h-16"
        />
      )}
    </div>
  );
};

export default TopBar;
