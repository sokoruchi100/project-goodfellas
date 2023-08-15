import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import UserContext from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import TagBox from "../components/TagBox";
import { getTags } from "../utils/TagsUtil";
import TopBar from "../components/TopBar";

function Dashboard() {
  const { isAuthenticated, handleAuthentication } = useAuth();
  const { userId } = useContext(UserContext);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (userId) {
      // Check if userId is available

      // Fetching the tags for the user upon component load
      getTags(userId)
        .then((tagsArray) => {
          setTags(tagsArray);
        })
        .catch((error) => {
          console.error("Error fetching tags for user:", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    // Make an API call to check if the user is authenticated
    axios
      .get("/auth/ensure", { withCredentials: true })
      .then((response) => {
        handleAuthentication(response.data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
      });
  }, [isAuthenticated, handleAuthentication]);

  const handleSubmitTags = () => {
    try {
      axios.post(`/tags/userTags/${userId}`, { tags: tags });
      console.log("Tags successfully updated");
    } catch (error) {
      console.error("Error updating tags:", error);
    }
  };

  return (
    <div>
      <TopBar />
      <Navbar handleAuthentication={handleAuthentication} />
      <div className="ml-24 p-4">
        <TagBox tags={tags} setTags={setTags} amount={10} />
        <button
          className="hover:bg-yellow-200 hover:text-black mt-4 px-2 py-1 text-white text-xl"
          onClick={handleSubmitTags}
        >
          Submit Tags
        </button>
      </div>

      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
}

export default Dashboard;
