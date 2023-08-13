import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the community ID from the URL
import axios from "axios"; // Assuming you are using axios for HTTP requests

const AddUserComponent = () => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState(""); // for user feedback

  const { roomCode } = useParams();

  const handleAddMember = async () => {
    try {
      const response = await axios.get(`/users/find-user/${userName}`);
      const userId = response.data.userId;

      if (userId) {
        const addResponse = await axios.post(`/membership`, {
          userId: userId,
          roomCode: roomCode,
        });
        if (addResponse.data.success) {
          setMessage("User has been added");
        } else if (addResponse.data.message === "User is already a member") {
          setMessage("User is already a member");
        }
      } else {
        setMessage("No user found with the given name");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <input
        className="bg-transparent border-b-2 border-gray-500 text-white font-normal px-1 py-0 text-lg w-2/3 mr-2"
        type="text"
        value={userName}
        placeholder="Add a member"
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        className="text-white bg-transparent font-normal px-1 py-0  text-lg"
        onClick={handleAddMember}
      >
        Add
      </button>
      <p>{message}</p>
    </div>
  );
};

export default AddUserComponent;
