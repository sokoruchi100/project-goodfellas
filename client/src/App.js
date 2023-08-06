import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InspirationEngine from "./InspirationEngine.js";
import Dashboard from "./Dashboard.js";
import Explore from "./Explore";
import Chatroom from "./Chatroom";
import Landing from "./Landing";
import SignUp from "./SignUp.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true" || false
  );

  // Function to update the isAuthenticated state
  const handleAuthentication = (value) => {
    setIsAuthenticated(value);
    localStorage.setItem("isAuthenticated", value);
  };

  // Clear the isAuthenticated state from localStorage on logout or when the app is unmounted
  useEffect(() => {
    return () => {
      localStorage.removeItem("isAuthenticated");
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route for the landing page */}
        <Route
          path="/"
          element={
            <Landing
              isAuthenticated={isAuthenticated}
              handleAuthentication={handleAuthentication}
            />
          }
        />

        {/* Route for the login page */}
        <Route
          path="/signup"
          element={
            <SignUp
              isAuthenticated={isAuthenticated}
              handleAuthentication={handleAuthentication}
            />
          }
        />

        {/* Route for the dashboard page */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              isAuthenticated={isAuthenticated}
              handleAuthentication={handleAuthentication}
            />
          }
        />

        {/* Route for the inspiration page */}
        <Route path="/InspirationEngine" element={<InspirationEngine />} />

        {/* Route for the explore page */}
        <Route
          path="/communities/explore"
          element={
            <Explore
              isAuthenticated={isAuthenticated}
              handleAuthentication={handleAuthentication}
            />
          }
        />

        {/* Route for the chatroom page */}
        <Route
          path="/communities/chatroom/:roomCode"
          element={
            <Chatroom
              isAuthenticated={isAuthenticated}
              handleAuthentication={handleAuthentication}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
