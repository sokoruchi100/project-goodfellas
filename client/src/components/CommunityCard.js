import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { arrayToString } from "../utils/TagsUtil";

function CommunityCard({ community, handleCommunityDeletion, userId }) {
  return (
    <Link to={`/communities/chatroom/${community.roomCode}`}>
      <div className="p-4 bg-gray-900 rounded-lg relative">
        {/* Tailwind classes for 3 column layout */}

        <img
          className="w-16 h-16 rounded-full float-left"
          src={community.communityPicture}
          alt=""
        />
        <div>
          <h6 className="text-white text-xl">{community.communityName}</h6>
          <p className="text-yellow-200 text-sm">
            Tags: {arrayToString(community.tags)}
          </p>
        </div>

        <p className="text-sm">{community.description}</p>

        {community.creatorId === userId && (
          <Button
            className="absolute z-10"
            text="Delete Community"
            onClick={() => handleCommunityDeletion(community.id)}
          />
        )}
      </div>
    </Link>
  );
}

export default CommunityCard;
