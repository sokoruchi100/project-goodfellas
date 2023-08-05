import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import InspirationEngine from "./InspirationEngine.js";
import Dashboard from "./Dashboard.js";
import Explore from "./Explore";
import Chatroom from "./Chatroom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Route for the inspiration page */}
        <Route path="/InspirationEngine" element={<InspirationEngine />} />

        {/* Route for the explore page */}
        <Route path="/communities/explore" element={<Explore />} />

        {/* Route for the chatroom page */}
        <Route path="/communities/chatroom/:roomCode" element={<Chatroom />} />
      </Routes>
    </Router>
  );
}

export default App;
