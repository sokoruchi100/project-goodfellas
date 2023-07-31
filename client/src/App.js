import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
