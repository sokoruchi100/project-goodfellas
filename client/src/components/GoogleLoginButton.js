import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faGoogle from "@fortawesome/free-solid-svg-icons";

const GoogleLoginButton = ({ onClick }) => {
  return (
    <button
      className="mt-32 w-3/4 flex flex-row items-center bg-white py-4 px-16 rounded-md border-2 border-black"
      onClick={onClick}
    >
      <img
        className="h-10 w-10 mr-8"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/882px-Google_%22G%22_Logo.svg.png?20230305195327"
      ></img>
      <span>Log in with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
