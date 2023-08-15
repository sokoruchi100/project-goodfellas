import React, { useEffect } from "react";
import { Navigate } from "react-router-dom"; // Import Link and Redirect from react-router-dom
import axios from "axios"; // Import axios
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const { isAuthenticated, handleAuthentication } = useAuth();
  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/auth/ensure", { withCredentials: true })
      .then((response) => {
        handleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [isAuthenticated, handleAuthentication]);

  const handleGoogleLogin = () => {
    // Replace "http://localhost:5000/auth/google" with your backend API endpoint for Google OAuth
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="bg-sky-700 h-screen flex flex-row">
      <div className="h-full w-1/3 flex flex-col justify-center pl-10 pb-20">
        <h2>Sign Up</h2>
        <p className="w-3/4 mt-2">
          Creating an account is easy. Sign up using your Google account to link
          to your YouTube.
        </p>
        <GoogleLoginButton onClick={handleGoogleLogin}></GoogleLoginButton>
      </div>
      <div className="h-full w-2/3 p-8 flex items-center">
        <img
          className="rounded-3xl"
          src="https://images.unsplash.com/photo-1613294326794-e7c74fe886e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        ></img>
      </div>

      {/* Redirect to Dashboard if authenticated */}
      {isAuthenticated && <Navigate to="/dashboard" />}
    </div>
  );
};

export default SignUp;
