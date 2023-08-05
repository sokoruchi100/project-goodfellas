import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom"; // Import Link and Redirect from react-router-dom
import axios from "axios"; // Import axios

const Landing = ({ isAuthenticated, handleAuthentication }) => {
  useEffect(() => {
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

  return (
    <div>
      <h1>Welcome to VisionVault</h1>
      <p>Please log in to connect to your YouTube account:</p>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>

      {/* Redirect to Dashboard if authenticated */}
      {isAuthenticated && <Navigate to="/dashboard" />}
    </div>
  );
};

export default Landing;
