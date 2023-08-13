import React from "react";

function MessagesList({ messages }) {
  return (
    <div className="h-5/6" style={{ overflowY: "auto" }}>
      {messages &&
        messages.map((message, index) => (
          <div key={index} className="message flex flex-row p-4">
            <div>
              {message.profilePicture && (
                <img
                  src={message.profilePicture}
                  alt="User Profile"
                  className="message-profile-pic rounded-full w-18 h-18"
                />
              )}
            </div>

            <div className="flex flex-col justify-around ml-4">
              <div className="flex flex-row items-baseline">
                <span className="text-sky-800 font-bold text-2xl">
                  {message.displayName}
                </span>
                {/* <span className="ml-2 text-white font-normal text-base">
                  {message.timeStamp.toLocaleString()}
                </span> */}
              </div>
              <p className="font-normal">{message.content}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default MessagesList;
