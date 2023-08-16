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
    <nav className="top-0 left-0 h-full w-24 bg-[#161616] fixed">
      <Link to="/dashboard" className="absolute w-[40px]">
        <img
<<<<<<< HEAD
            className="ml-5"
            alt=""
            src="/visionvaultlogo4-1@2x.png"
          />
=======
          className="absolute top-[16px] left-[27px] w-[40px] h-[50px] object-cover"
          alt=""
          src={`${process.env.PUBLIC_URL}/visionvaultlogo4-1@2x.png`}
        />
>>>>>>> 2cd0630cb5b9e4f5f8603ec01197974c815d829b
      </Link>
      <ul className="flex flex-col h-full justify-center p-0">
        <li className="flex justify-center">
          <Link to="/dashboard">
            <FontAwesomeIcon
              className="w-12 h-12 text-[#40659A] transition duration-300 ease-in-out hover:text-[#75afff]"
              icon={faBorderAll}
            />
          </Link>
        </li>
        <li className="flex justify-center">
          <Link to="/inspirationengine">
            <FontAwesomeIcon
              className="w-12 h-12 text-[#40659A] transition duration-300 ease-in-out hover:text-[#75afff]"
              icon={faLightbulb}
            />
          </Link>
        </li>
        <li className="flex justify-center">
          <Link to="/communities/explore">
            <FontAwesomeIcon
              className="w-12 h-12 text-[#40659A] transition duration-300 ease-in-out hover:text-[#75afff]"
              icon={faComments}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
