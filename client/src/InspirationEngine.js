import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";

const InspirationEngine = () => {
  const [title, setTitle] = useState(""); // New State
  const [summary, setSummary] = useState(""); // New State
  const [videoLink, setVideoLink] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [myVidDetails, setMyVidDetails] = useState([]);
  const [output, setOutput] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const processOutput = (data) => {
    const sentences = data.split(/[.!?]/).map((sentence) => sentence.trim());
    console.log(sentences);
    console.log(sentences[1]);
    // Extract string within quotation marks from the title sentence
    const titleMatch = sentences[1].match(/"(.*?)"/);
    console.log(titleMatch);
    if (titleMatch) {
      setTitle(titleMatch[1]);
    }

    // Store everything that comes after the title sentence
    if (sentences.length > 2) {
      setSummary(sentences.slice(2).join(". ").trim());
    }
  };

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
      console.log(aiOutput.data);
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
    if (output) {
      processOutput(output);
    }
  }, [output]);

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
        className="absolute top-[0px] left-[71.94px] w-[1368.06px] h-[3626px] z-[-1]"
        alt=""
        src="/misc.svg"
      />

      <div className="ml-24 mt-[450px] pl-5 w-2/3 h-[113px] ">
        <div className="flex">
          <div className="flex-none w-14">
            <div className="mt-14 bg-primary w-[113px] h-px [transform:_rotate(-90deg)] " />
          </div>
          <div className="flex-initial ">
            <div className="pl-4 tracking-[0.01em] font-semibold text-[50px] text-secondary font-urbanist ">
              Inspiration Engine
            </div>
            <div className="pl-4 text-[18px] leading-[23.4px] font-light font-roboto text-white-text">
              Create new ideas through personalization
            </div>
          </div>
          <div className="flex-initial">
            <img
              className="pl-4 pt-4 w-12"
              alt=""
              src="/visionvaultlogo1-1@2x.png"
            />
          </div>
        </div>
        <div className="ml-24 w-2/3">
          <div className="mt-[600px] tracking-[0.01em] text-[50px] text-secondary font-urbanist ">
            Your Videos
          </div>
          <div className="mt-8 text-[15px] leading-[27px] font-thin font-roboto text-white-text">
            The Inspiration Generator will use the videos from your channel to
            learn more about the types of material you are interested in.
          </div>
          <div className="mt-4 text-[16px] leading-[27px] font-bold font-roboto text-secondary">
            3 Videos from your channel that will be used
          </div>

          <div className="flex mt-8">
            {myVidDetails.map((video, index) => (
              <div
                className="flex-initial pr-5 w-[360px] h-[120px]"
                key={index}
              >
                <img
                  className=" object-cover w-[360px] h-[120px]"
                  src={video.thumbnail}
                  alt="Your Video"
                />
                <div className="text-white-text text-[13px] text-center">
                  {video.title}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-24 w-2/3">
          <div className="mt-[600px] tracking-[0.01em] text-[50px] text-secondary font-urbanist ">
            Inspiration
          </div>
          <div className="mt-8 text-[15px] leading-[27px] font-thin font-roboto text-white-text">
            The Inspiration Generator will use other content creators' videos
            that are similar to yours to help create an idea for you. Please
            enter a youtube video url in which you would like to draw
            inspiration from.
          </div>

          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-200 focus:border-yellow-200 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-200 dark:focus:border-yellow-200"
            type="text"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />
          <div className="container">
            <button className="mt-24 text-slate-50" onClick={passAllData}>
              Button
            </button>
          </div>
        </div>
        <div className=" mt-[300px] tracking-[0.01em] text-[50px] text-secondary font-urbanist">
          Generated Content
        </div>
        <div className="p-5 w-full bg-black rounded-xl mt-10 shadow-xl shadow-black">
          <h2 className="mb-5">{title}</h2> {/* Display the extracted title */}
          <p className="text-3xl">{summary}</p>{" "}
          {/* Display the extracted summary */}
        </div>
      </div>
    </div>
  );
};

export default InspirationEngine;
