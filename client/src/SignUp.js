import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom"; // Import Link and Redirect from react-router-dom
import axios from "axios"; // Import axios
import GoogleLoginButton from "./GoogleLoginButton";

const SignUp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/api/ensure-auth", { withCredentials: true }) // Use withCredentials to include cookies in the request
      .then((response) => {
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, []);
  const handleGoogleLogin = () => {
    // Replace "http://localhost:5000/auth/google" with your backend API endpoint for Google OAuth
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div>
      <h1>Click the Google Login Button Below to login</h1>
      <GoogleLoginButton onClick={handleGoogleLogin}></GoogleLoginButton>

      {/* Redirect to Dashboard if authenticated */}
      {isAuthenticated && <Navigate to="/dashboard" />}
    </div>
  );
};

export default SignUp;
