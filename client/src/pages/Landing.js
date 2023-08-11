import React, { useEffect } from "react";
import { Link, Navigate } from "react-router-dom"; // Import Link and Redirect from react-router-dom
import axios from "axios"; // Import axios
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { isAuthenticated, handleAuthentication } = useAuth();

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/auth/ensure", { withCredentials: true })
      .then((response) => {
        handleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [isAuthenticated, handleAuthentication]);

  return (
    <div>
      <div className="bg-black Landing-Section">
        <div className="Logo">
          <span>VisionVault</span>
          <span>ICON</span>
        </div>
        <h1>Create new ideas from nothing</h1>
        <p>
          Having trouble with new ideas for your next Youtube video? Is reaching
          out to different content creators difficult for you? VisionVault has
          you covered.
        </p>
        <Link to="/signup">
          <button>Generate new ideas</button>
        </Link>

        {/* Redirect to Dashboard if authenticated */}
        {isAuthenticated && <Navigate to="/dashboard" />}
      </div>
      <div className="bg-blue-500 h-full w-full Landing-Section">
        <h2 className="text-center">Inspiration Engine</h2>
        <p className="text-center">
          Leverage the power of artificial intelligence to create unique ideas
          personalized for your content.
        </p>
        <div className="bg-gray-700">
          <p className="w-72">
            Input 4 of your own videos for the artificial intelligence to
            analyze. All new ideas are personalized around your content, making
            sure that each idea is still grounded within your content.
          </p>
        </div>
      </div>
      <div className="bg-blue-500 h-full w-full Landing-Section flex">
        <div className="w-2/5">
          <div className="bg-gray-700">01</div>
          <div className="bg-gray-700">02</div>
          <div className="bg-gray-700">03</div>
        </div>
        <div className="w-3/5">
          <h2>Discover new communities</h2>
          <p className="">
            Input 4 of your own videos for the artificial intelligence to
            analyze. All new ideas are personalized around your content, making
            sure that each idea is still grounded within your content.
          </p>
        </div>
      </div>
      <div className="bg-blue-500 h-full w-full grid grid-cols-3 space-x-10 Landing-Section">
        <div className="text-center bg-gray-700 h-64">01</div>
        <div className="text-center bg-gray-700 h-64">01</div>
        <div className="text-center bg-gray-700 h-64">01</div>
      </div>
      <div className="bg-blue-500 h-full w-full Landing-Section flex">
        <div className="w-1/2">
          <h2>Frequently asked questions</h2>
        </div>
        <div className="w-1/2">
          <div className="bg-gray-700">01</div>
          <div className="bg-gray-700">02</div>
          <div className="bg-gray-700">03</div>
          <div className="bg-gray-700">04</div>
        </div>
      </div>
      <div className="bg-blue-500 h-full w-full Landing-Section flex flex-col">
        <h2 className="text-center">Start creating now!</h2>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
      <footer className="bg-black h-full w-full flex justify-evenly">
        <p>2023 VisualVault</p>
        <p>Terms of Service</p>
        <p>Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Landing;
