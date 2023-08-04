import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import InspirationEngine from './InspirationEngine.js';
import Dashboard from "./Dashboard.js";
import Chatroom from "./Chatroom.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add other routes here */}
        <Route path="/chatroom" element={<Chatroom />} />

        <Route path="/InspirationEngine" element={<InspirationEngine />} />
      </Routes>
    </Router>
  );
}

export default App;
