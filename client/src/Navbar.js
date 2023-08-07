import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you are using React Router for navigation
import axios from "axios";
import { useAuth } from "./context/AuthContext";

const Navbar = () => {
  const { handleAuthentication } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Make an API call to logout
    axios
      .get("/auth/logout", { withCredentials: true })
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
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/communities/explore">Communities</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Log out</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
