import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";

function ReviewCard({ profilePicture, userName, rating, reviewText }) {
  return (
    <div className="bg-black shadow-lg p-4 rounded transform transition-transform duration-300 hover:scale-105 hover:shadow-md flex flex-col justify-between h-3/4">
      <div>
        <img
          src={profilePicture}
          alt={userName}
          className="mx-auto w-24 h-24 rounded-full mb-4"
        />
        <h4 className="text-center text-white mb-2">{userName}</h4>

        {/* Star Rating */}
        <div className="flex justify-center mb-4">
          {Array(5)
            .fill()
            .map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={i < rating ? "text-yellow-500" : "text-gray-400"}
              />
            ))}
        </div>

        <p className="text-white mb-4 text-center">{reviewText}</p>
      </div>

      <div className="border-b border-white w-full"></div>
    </div>
  );
}

export default ReviewCard;
