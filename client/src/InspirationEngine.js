import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";

const InspirationEngine = () => {
  const [videoLink, setVideoLink] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [myVidDetails, setMyVidDetails] = useState([]);
  const [output, setOutput] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const extractVideoId = (link) => {
    const regex = /(?:v=)([^&]+)/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };
  const passAllData = async () => {
    try {
      let vidDetails = await fetchDetails();
      console.log(vidDetails);
      let aiOutput = await axios.post(`http://localhost:5000/gpt-api-call`, {
        vidDetails,
        myVidDetails,
      });
      setOutput(aiOutput.data);
      console.log("Output", aiOutput.data);
    } catch (error) {
      console.error("Failed to send data", error);
    }
  };
  const fetchDetails = async () => {
    const videoId = extractVideoId(videoLink);
    try {
      const response = await axios.get(
        `http://localhost:5000/videoDetails?videoId=${videoId}`
      );
      setVideoDetails(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch video details:", error);
    }
  };

  useEffect(() => {
    fetch("/my-video-details")
      .then((response) => response.json())
      .then((data) => setMyVidDetails(data))
      .catch((error) => console.error("Error fetching video titles:", error));
  }, []);

  return (
    <div>
        <TopBar />
        <Navbar />
        <img
          className="absolute top-[0px] left-[71.94px] w-[1368.06px] h-[3626px]"
          alt=""
          src="/misc.svg"
        />


      <div className="ml-24 mt-[450px] pl-5 w-[732px] h-[113px] ">
        <div class="flex">
            <div class="flex-none w-14">
                <div className="mt-14 bg-primary w-[113px] h-px [transform:_rotate(-90deg)] " />
            </div>
            <div class="flex-initial ">
                <div className="pl-4 tracking-[0.01em] font-semibold text-[50px] text-secondary font-urbanist ">
                    Inspiration Engine
                </div>
                <h3 className="pl-4 text-[18px] leading-[23.4px] font-light font-roboto text-white-text">
                    Create new ideas through personalization
                </h3>
            </div>
            <div class="flex-initial">
                <img
                    className="pl-4 w-10"
                    alt=""
                    src="/visionvaultlogo1-1@2x.png"
                />
            </div>
        </div>

      
        <h1>Your Videos</h1>
        {myVidDetails.map((video, index) => (
          <div key={index}>
            <img src={video.thumbnail} alt="Your Video" />
            <h1>{video.title}</h1>
            <h2>{video.description}</h2>
          </div>
        ))}
        <input
          type="text"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />
        <button onClick={passAllData}>Button</button>

        <h2>Generated Content</h2>
        <h2>{output}</h2>
      </div>
    </div>
  );
};

export default InspirationEngine;
