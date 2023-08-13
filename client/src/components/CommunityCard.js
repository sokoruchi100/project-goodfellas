import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { arrayToString } from "../utils/TagsUtil";

function CommunityCard({ community, handleCommunityDeletion, userId }) {
  return (
    <Link to={`/communities/chatroom/${community.roomCode}`}>
      <div className="p-4 bg-gray-900 rounded-lg relative flex flex-col justify-between h-1/3">
        {/* Tailwind classes for 3 column layout */}

        <div className="flex flex-row">
          <div>
            <img
              className="w-16 h-16 rounded-full float-left"
              src={community.communityPicture}
              alt=""
            />
          </div>

          <div className="ml-4">
            <h6 className="text-white text-lg font-bold">
              {community.communityName}
            </h6>
            <p className="text-yellow-200 text-sm">
              {arrayToString(community.tags)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm">{community.description}</p>
        </div>

        <div className="relative">
          {community.creatorId === userId && (
            <button
              className="absolute bottom-0 right-0 z-10 text-sm bg-red-700 px-2 py-1"
              onClick={() => handleCommunityDeletion(community.id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;
