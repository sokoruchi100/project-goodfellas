import React, { useState, useEffect } from "react";
import axios from "axios";

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
      <div className="relative bg-whitesmoke w-full h-[3556px] overflow-hidden text-left text-[50px] text-secondary font-urbanist">
        <div className="absolute top-[0px] left-[70px] w-[1370px] h-[3556px]  bg-cover bg-no-repeat bg-[top]">
          <div className="absolute h-[0.61%] w-[276.57%] top-[99.43%] right-[-176.57%] bottom-[-0.04%] left-[0%] bg-gainsboro-200 [transform:_rotate(-68.93deg)] [transform-origin:0_0] hidden" />
          <div className="absolute h-[0.61%] w-[276.57%] top-[100%] right-[-276%] bottom-[-0.61%] left-[99.43%] bg-gainsboro-200 [transform:_rotate(-111.07deg)] [transform-origin:0_0] hidden" />
        </div>
        <img
          className="absolute top-[0px] left-[71.94px] w-[1368.06px] h-[3626px]"
          alt=""
          src="/misc.svg"
        />
        <div className="absolute top-[456px] left-[105px] w-[732px] h-[113px]">
          <div className="absolute top-[6px] left-[calc(50%_-_357px)] tracking-[-0.01em] font-semibold">
            Inspiration Engine
          </div>
          <div className="absolute top-[113px] left-[1px] bg-primary w-[113px] h-px [transform:_rotate(-90deg)] [transform-origin:0_0]" />
          <div className="absolute top-[75px] left-[9px] text-[18px] leading-[23.4px] font-light font-roboto text-white-text flex items-center w-[723px]">
            Create new ideas through personalization
          </div>
          <img
            className="absolute top-[16px] left-[412px] w-[37px] h-[50px] object-cover"
            alt=""
            src="/visionvaultlogo1-1@2x.png"
          />
        </div>
        <div className="absolute top-[3464px] left-[561px] w-[266px] h-[57px] text-16xl text-gray-100">
          <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-mini bg-primary box-border border-[1px] border-solid border-white-text" />
          <div className="absolute top-[14.04%] left-[22.18%] font-medium">
            Generate
          </div>
        </div>
        <div className="fixed top-[381px] left-[1126px] w-[314px] h-[280px] text-6xl text-white-text">
          <div className="absolute h-[27.14%] w-full top-[0%] right-[0%] bottom-[72.86%] left-[0%]">
            <div className="absolute h-full w-[111.15%] top-[0%] right-[0%] bottom-[0%] left-[-11.15%] overflow-hidden">
              <div className="absolute top-[0px] left-[0px] bg-gainsboro-100 w-[432px] h-[76px] hidden" />
              <div className="absolute top-[15px] left-[40px] rounded-[50%] bg-primary w-[47px] h-[47px]" />
              <div className="absolute top-[23px] left-[107px] tracking-[-0.01em] font-semibold flex items-center w-[310px]">
                Your Videos
              </div>
              <div className="absolute top-[24px] left-[56px] tracking-[-0.01em] font-semibold font-roboto text-white">
                1
              </div>
            </div>
          </div>
          <div className="absolute h-[27.14%] w-full top-[24.29%] right-[0%] bottom-[48.57%] left-[0%]">
            <div className="absolute h-full w-[111.15%] top-[0%] right-[0%] bottom-[0%] left-[-11.15%] overflow-hidden">
              <div className="absolute top-[0px] left-[0px] bg-gainsboro-100 w-[432px] h-[76px] hidden" />
              <div className="absolute top-[15px] left-[40px] rounded-[50%] bg-primary w-[47px] h-[47px]" />
              <div className="absolute top-[23px] left-[107px] tracking-[-0.01em] font-semibold flex items-center w-[310px]">
                Inspiration
              </div>
              <div className="absolute top-[24px] left-[56px] tracking-[-0.01em] font-semibold font-roboto text-white">
                2
              </div>
            </div>
          </div>
          <div className="absolute h-[27.14%] w-full top-[48.57%] right-[0%] bottom-[24.29%] left-[0%]">
            <div className="absolute h-full w-[111.15%] top-[0%] right-[0%] bottom-[0%] left-[-11.15%] overflow-hidden">
              <div className="absolute top-[0px] left-[0px] bg-gainsboro-100 w-[432px] h-[76px] hidden" />
              <div className="absolute top-[15px] left-[40px] rounded-[50%] bg-primary w-[47px] h-[47px]" />
              <div className="absolute top-[23px] left-[107px] tracking-[-0.01em] font-semibold flex items-center w-[310px]">
                Refining the Idea
              </div>
              <div className="absolute top-[24px] left-[56px] tracking-[-0.01em] font-semibold font-roboto text-white">
                3
              </div>
            </div>
          </div>
          <div className="absolute h-[27.14%] w-full top-[72.86%] right-[0%] bottom-[0%] left-[0%]">
            <div className="absolute h-full w-[111.15%] top-[0%] right-[0%] bottom-[0%] left-[-11.15%] overflow-hidden">
              <div className="absolute top-[0px] left-[0px] bg-gainsboro-100 w-[432px] h-[76px] hidden" />
              <div className="absolute top-[15px] left-[40px] rounded-[50%] bg-primary w-[47px] h-[47px]" />
              <div className="absolute top-[23px] left-[107px] tracking-[-0.01em] font-semibold flex items-center w-[310px]">
                Final Product
              </div>
              <div className="absolute top-[24px] left-[56px] tracking-[-0.01em] font-semibold font-roboto text-white">
                4
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[15px] left-[1151px] w-[273px] h-[51px] text-xl text-black">
          <div className="absolute h-full w-[19.05%] top-[0%] right-[0%] bottom-[0%] left-[80.95%]">
            <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50%] bg-dimgray-200" />
            <div className="absolute h-[66%] w-[66%] top-[18%] right-[18%] bottom-[16%] left-[16%]">
              <div className="absolute h-[0.17%] w-[139.9%] top-[100%] right-[-139.78%] bottom-[-0.17%] left-[99.88%] bg-gainsboro-100 [transform:_rotate(-135.56deg)] [transform-origin:0_0]" />
              <div className="absolute h-[0.17%] w-[139.9%] top-[99.88%] right-[-39.9%] bottom-[-0.05%] left-[0%] bg-gainsboro-100 [transform:_rotate(-44.44deg)] [transform-origin:0_0]" />
            </div>
          </div>
          <img
            className="absolute h-full w-[19.05%] top-[0%] right-[0%] bottom-[0%] left-[80.95%] rounded-65xl max-w-full overflow-hidden max-h-full object-cover"
            alt=""
            src="/garfieldcharacter-4@2x.png"
          />
          <div className="absolute h-[66.67%] w-[51.65%] top-[15.69%] right-[44.32%] bottom-[17.65%] left-[4.03%]">
            <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-8xs bg-secondary box-border border-[1px] border-solid border-white-text" />
            <div className="absolute h-[52.94%] w-[62.41%] top-[23.53%] left-[19.15%] tracking-[-0.01em] font-semibold flex items-center">
              Subscribe
            </div>
          </div>
          <img
            className="absolute h-[41.18%] w-[7.67%] top-[29.41%] right-[27.87%] bottom-[29.41%] left-[64.47%] max-w-full overflow-hidden max-h-full"
            alt=""
            src="/vector.svg"
          />
        </div>
        <div className="absolute top-[0px] left-[0px] w-[70px] h-[1024px]">
          <div className="absolute h-[347.27%] w-full top-[0%] right-[0%] bottom-[-247.27%] left-[0%]">
            <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] bg-background-1" />
          </div>
          <div className="absolute top-[355px] left-[20px] flex flex-col items-start justify-start gap-[63px]">
            <img
              className="relative w-[30px] h-[30px]"
              alt=""
              src="/vector1.svg"
            />
            <div className="relative bg-dimgray-100 w-[30px] h-[30px] hidden" />
            <div className="relative bg-dimgray-100 w-[30px] h-[30px] hidden" />
          </div>
          <img
            className="absolute top-[449px] left-[21px] w-[27px] h-[34px] object-cover"
            alt=""
            src="/visionvaultlogo3-1@2x.png"
          />
          <img
            className="absolute h-[2.83%] w-[51.43%] top-[53.42%] right-[24.29%] bottom-[43.75%] left-[24.29%] max-w-full overflow-hidden max-h-full"
            alt=""
            src="/vector2.svg"
          />
          <img
            className="absolute h-[2.93%] w-[42.86%] top-[62.5%] right-[30%] bottom-[34.57%] left-[27.14%] max-w-full overflow-hidden max-h-full"
            alt=""
            src="/vector3.svg"
          />
          <img
            className="absolute top-[12px] left-[20px] w-[30px] h-10 object-cover"
            alt=""
            src="/visionvaultlogo4-1@2x.png"
          />
        </div>
      </div>

      <div className="">
        <img src={selectedImage} />
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
