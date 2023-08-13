import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const Navbar = () => {
  return (
    <nav>
      <Link to="/dashboard" className="absolute">
        LOGO
      </Link>
      <ul className="flex flex-col h-full justify-center">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/inspirationengine">Inspiration Engine</Link>
        </li>
        <li>
          <Link to="/communities/explore">Communities</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
