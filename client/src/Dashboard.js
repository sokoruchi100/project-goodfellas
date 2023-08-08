import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import UserContext from "./context/UserContext";
import { useAuth } from "./context/AuthContext";
import TagBox from "./components/TagBox";
import Button from "./components/Button";
import { arrayToString, postTags, getTags } from "./utils/TagsUtil";
import TopBar from "./components/TopBar";

function Dashboard() {
  const { isAuthenticated, handleAuthentication } = useAuth();
  const { userId } = useContext(UserContext);
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (userId) {
      // Check if userId is available

      // Fetching the tags for the user upon component load
      getTags(userId)
        .then((tagsArray) => {
          const tagsString = arrayToString(tagsArray);
          setTags(tagsString);
        })
        .catch((error) => {
          console.error("Error fetching tags for user:", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/api/ensure-auth", { withCredentials: true })
      .then((response) => {
        handleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [isAuthenticated, handleAuthentication]);

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmitTags = () => {
    postTags(userId, tags)
      .then((response) => {
        console.log("Tags successfully updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating tags:", error);
      });
  };

  return (
    <div>
      <TopBar />
      <Navbar handleAuthentication={handleAuthentication} />
      <TagBox value={tags} onChange={handleTagsChange} />
      <Button text="Submit Tags" onClick={handleSubmitTags} />
      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
}

export default Dashboard;
