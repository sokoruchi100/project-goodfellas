import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import { arrayToString } from "../utils/TagsUtil";

function CommunityCard({ community, handleCommunityDeletion, userId }) {
  return (
    <div className="w-1/3 p-4">
      {/* Tailwind classes for 3 column layout */}
      <Link to={`/communities/chatroom/${community.roomCode}`}>
        <h2>{community.communityName}</h2>
      </Link>
      <img src={community.communityPicture} alt="" />
      <p>Tags: {arrayToString(community.tags)}</p>
      <p>{community.description}</p>
      {community.creatorId === userId && (
        <Button
          text="Delete Community"
          onClick={() => handleCommunityDeletion(community.id)}
        />
      )}
    </div>
  );
}

export default CommunityCard;
