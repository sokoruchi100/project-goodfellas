import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Explore from "./Explore";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Route for the explore page */}
        <Route path="/communities/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}

export default App;
