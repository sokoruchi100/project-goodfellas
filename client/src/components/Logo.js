import React from "react";

const Logo = () => {
  return (
    <div className="Logo flex flex-row items-center px-8 py-4">
      <span className="text-4xl">VisionVault</span>
      <img
        className="scale-50"
        src={`${process.env.PUBLIC_URL}/visionvaultlogo4-1@2x.png`}
      ></img>
    </div>
  );
};

export default Logo;
