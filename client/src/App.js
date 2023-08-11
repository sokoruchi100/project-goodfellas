import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InspirationEngine from "./pages/InspirationEngine.js";
import Dashboard from "./pages/Dashboard.js";
import Explore from "./pages/Explore";
import Chatroom from "./pages/Chatroom";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp.js";
import UserProvider from "./provider/UserProvider.js";
import { AuthProvider } from "./context/AuthContext.js";

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Route for the landing page */}
            <Route path="/" element={<Landing />} />

            {/* Route for the login page */}
            <Route path="/signup" element={<SignUp />} />

            {/* Route for the dashboard page */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Route for the inspiration page */}
            <Route path="/InspirationEngine" element={<InspirationEngine />} />

            {/* Route for the explore page */}
            <Route path="/communities/explore" element={<Explore />} />

            {/* Route for the chatroom page */}
            <Route
              path="/communities/chatroom/:roomCode"
              element={<Chatroom />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;
