import ImageUpload from "../components/ImageUpload";
import { validateInputLength } from "../utils/validate";
import React, { useState } from "react";
import axios from "axios";
import TagBox from "./TagBox";

const CreateCommunityOverlay = ({
  userId,
  setAllCommunities,
  showCreateCommunityOverlay,
  setShowCreateCommunityOverlay,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true); // Set the default value to true
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const generateRoomCode = () => {
    const roomCodeLength = 25;
    // Function to generate a random roomCode
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let roomCode = "";
    for (let i = 0; i < roomCodeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters.charAt(randomIndex);
    }
    return roomCode;
  };

  const handleCreateChatroom = async (e) => {
    e.preventDefault();
    //Performs checks
    if (
      !validateInputLength(name, 1, 50) ||
      !validateInputLength(description, 1, 200) ||
      tags.length === 0
    ) {
      return;
    }

    // Function to handle the creation of a new chatroom
    const roomCode = generateRoomCode();

    // Make an API call to store the new chatroom in the database
    try {
      const result = await axios.post("/communities", {
        roomCode: roomCode,
        creatorId: userId,
        communityName: name,
        description: description,
        isPublic: isPublic,
        communityPicture: imageUrl,
      });

      await handleSubmitTags(result.data.communityId);

      // Refetch the communities
      const response = await axios.get("/communities");
      setAllCommunities(response.data);

      // Clear the form fields
      setName("");
      setDescription("");
      setIsPublic(true);
      setTags([]); // Clearing the tags
      setImageUrl(""); // Clearing the imageUrl
      setShowCreateCommunityOverlay(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleShowCreateCommunityOverlay = (e) => {
    setShowCreateCommunityOverlay(false);
  };

  const handleSubmitTags = async (communityId) => {
    const lowerCaseTags = tags.map((tag) => tag.toLowerCase());
    try {
      await axios.post(`/tags/communityTags/${communityId}`, {
        tags: lowerCaseTags,
      });
      console.log("Tags successfully updated");
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  return (
    showCreateCommunityOverlay && (
      <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-black z-10">
        <div className="absolute bg-gray-800 rounded-xl h-3/5 w-1/2 px-10 pt-20 pb-5">
          <div className="absolute top-1 right-1  ">
            <button
              className="font-normal border-none text-white bg-transparent"
              onClick={handleShowCreateCommunityOverlay}
            >
              X
            </button>
          </div>
          <form className="flex flex-col h-full">
            <div className="flex flex-row justify-between mb-20 h-1/5">
              <div className="flex flex-col w-2/3">
                <input
                  className="mb-4 p-2 bg-transparent border-b border-current placeholder-white text-white w-full text-3xl font-urbanist"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Community Name"
                />
                <TagBox
                  className="w-full"
                  tags={tags}
                  setTags={setTags}
                  amount={5}
                />
              </div>
              <ImageUpload
                className="w-1/3 flex "
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
              />
            </div>

            <div className="h-1/5 relative">
              <select
                className="w-40 h-9 bg-transparent border rounded-md border-white text-white bg-gray-800 pl-2 outline-none"
                value={isPublic ? "public" : "private"}
                onChange={(e) => setIsPublic(e.target.value === "public")}
              >
                <option className="py-2 pl-2 bg-gray-700" value="public">
                  Public
                </option>
                <option className="py-2 pl-2 bg-gray-700" value="private">
                  Private
                </option>
              </select>
            </div>

            <div className="h-3/5 my-4 relative">
              <textarea
                className="w-full h-full bg-gray-400 bg-opacity-50 border rounded-md p-3 placeholder-white outline-none text-white text-base resize-none font-roboto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a Description"
              ></textarea>
              <div className="absolute opacity-50 inset-0 border border-white rounded-lg pointer-events-none transform -translate-x-4 -translate-y-4"></div>
            </div>
            <div className="flex justify-end h-1/5">
              <button
                className="text-white bg-sky-700 px-10 w-1/3 cursor-pointer hover:bg-yellow-200 hover:text-black transition"
                onClick={(e) => handleCreateChatroom(e)}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateCommunityOverlay;
