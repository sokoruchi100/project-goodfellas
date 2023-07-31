import React from "react";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const handleGoogleLogin = () => {
    // Replace "http://localhost:5000/auth/google" with your backend API endpoint for Google OAuth
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div>
      <h1>Welcome to My YouTube App</h1>
      <p>Please log in to connect to your YouTube account:</p>
      <GoogleLoginButton onClick={handleGoogleLogin}></GoogleLoginButton>
    </div>
  );
};

export default Login;
