import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";

function ReviewCard({ profilePicture, userName, rating, reviewText }) {
  return (
    <div className="z-10 bg-gray-800 shadow-lg shadow-black p-4 rounded transform duration-300 hover:scale-105 hover:shadow-xl transition-all hover:shadow-gray-900 flex flex-col justify-between h-3/4">
      <div>
        <img
          src={profilePicture}
          alt={userName}
          className="mx-auto w-24 h-24 rounded-full mb-4"
        />
        <h4 className="text-center text-white font-bold text-2xl mb-2">
          {userName}
        </h4>

        {/* Star Rating */}
        <div className="flex justify-center my-5">
          {Array(5)
            .fill()
            .map((_, i) => (
              <FontAwesomeIcon
                key={i}
                icon={faStar}
                className={
                  (i < rating ? "text-yellow-500" : "text-gray-400") +
                  " text-2xl"
                }
              />
            ))}
        </div>

        <p className="text-white text-center">{reviewText}</p>
      </div>

      <div className="border-b border-white w-full"></div>
    </div>
  );
}

export default ReviewCard;
