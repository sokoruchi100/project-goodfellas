import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/communities/explore">Explore</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
