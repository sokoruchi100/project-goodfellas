import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faLightbulb,
  faComments,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav className="top-0 left-0 h-full w-24 bg-black fixed">
      <Link to="/dashboard" className="absolute">
        LOGO
      </Link>
      <ul className="flex flex-col h-full justify-center p-0">
        <li className="flex justify-center">
          <Link to="/dashboard">
            <FontAwesomeIcon
              className="w-12 h-12 text-sky-700"
              icon={faBorderAll}
            />
          </Link>
        </li>
        <li className="flex justify-center">
          <Link to="/inspirationengine">
            <FontAwesomeIcon
              className="w-12 h-12 text-sky-700"
              icon={faLightbulb}
            />
          </Link>
        </li>
        <li className="flex justify-center">
          <Link to="/communities/explore">
            <FontAwesomeIcon
              className="w-12 h-12 text-sky-700"
              icon={faComments}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
