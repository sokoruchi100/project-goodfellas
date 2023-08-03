import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Navbar from "./Navbar";
import Dashboard from "./Dashboard";
import Chatroom from "./Chatroom";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Route for the login page */}
          <Route path="/" element={<Login />} />

          {/* Route for the dashboard page */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Add other routes here */}
          <Route path="/chatroom" element={<Chatroom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
