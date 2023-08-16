import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import UserContext from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import TagBox from "../components/TagBox";
import { getTags } from "../utils/TagsUtil";
import TopBar from "../components/TopBar";
import { motion } from "framer-motion"

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
      
      <div className="flex ml-24 p-4">
        <div className="flex-initial mt-[100px] pl-12">
          <motion.div
              initial={{ opacity: 0, x:-20 }}
              animate={{ opacity: 1, x:0 }}
              transition={{ ease: "easeOut", duration: .5 }}
            >
            <div className=" text-[80px] font-extrabold tracking-wide text-zinc-100">
              Why Start
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y:50 }}
            animate={{ opacity: 1, y:0 }}
            transition={{ delay: .2, duration: .5 }}
          >
            <div className="ml-24 text-[80px] font-extrabold tracking-wide text-yellow-200">
              With <span className="text-zinc-800 bg-slate-100 font-[11000] transition duration-300 ease-in-out hover:bg-[#40659A]">Nothing</span>
            </div>
          </motion.div>
        </div>
        <motion.div
            initial={{ opacity: 0, x:50 }}
            animate={{ opacity: 1, x:0 }}
            transition={{ duration: .5 }}
          >
            <img
            className="flex-initial h-24 ml-6 mt-[190px]"
            alt=""
            src="/visionvaultlogo4-1@2x.png"
          />
        </motion.div>
      </div>
      <div className="ml-[550px] mt-8 z-3">
      <button class="text-zinc-100 font-extralight transition ease-in-out delay-150 bg-blue-500 hover:translate-x-5 hover:bg-yellow-200 duration-300 hover:text-zinc-800">
        <a className="transition ease-in-out delay-150 hover:text-zinc-800" href="/inspirationengine">Generate new idea</a>
      </button>
      </div>

        <svg className="-z-1 absolute ml-[700px]" width="270" height="270" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle stroke="#40659A" stroke-width=".5" cx="32" cy="32" r="31" fill="none"/></svg>
        <svg className="-z-1 absolute ml-[700px] transition duration-300 ease-in-out hover:-translate-y-3 hover:-translate-x-4" width="270" height="270" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle stroke="#6B6C6E" stroke-width=".5" cx="32" cy="32" r="31" fill="none"/></svg>

        <svg className="-z-1 absolute top-0 right-0 mr-[90px] mt-[50px]" width="400" height="400" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle stroke="#40659A" stroke-width=".5" cx="32" cy="32" r="31" fill="none"/></svg>
        <svg className="-z-1 absolute top-0 right-0 mr-[90px] mt-[50px] transition duration-300 ease-in-out hover:-translate-y-3 hover:-translate-x-3" width="400" height="400" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle stroke="#6B6C6E" stroke-width=".5" cx="32" cy="32" r="31" fill="none"/></svg>
      {!isAuthenticated && <Navigate to="/" />}
    </div>
  );
}

export default Dashboard;
