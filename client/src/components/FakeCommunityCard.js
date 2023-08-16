import React from "react";

function FakeCommunityCard({
  communityPicture,
  communityName,
  tags,
  description,
}) {
  return (
    <div className="z-10 absolute transition-all hover:scale-105 hover:shadow-xl shadow-lg shadow-black p-4 bg-gray-900 rounded-lg flex flex-col justify-between h-1/3 w-1/3">
      {/* Tailwind classes for 3 column layout */}

      <div className="flex flex-row">
        <div>
          <img
            className="w-24 h-24 rounded-full float-left"
            src={communityPicture}
            alt=""
          />
        </div>

        <div className="ml-4">
          <h6 className="text-white text-3xl font-bold">{communityName}</h6>
          <p className="text-yellow-200 text-lg">{tags}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xl">{description}</p>
      </div>
    </div>
  );
}

export default FakeCommunityCard;
