import React, {useState, useEffect} from 'react';
import axios from 'axios';

const InspirationEngine = ({ isAuthenticated, handleAuthentication }) => {
    const [videoLink, setVideoLink] = useState('');
    const [videoDetails, setVideoDetails] = useState(null);
    const [myVidDetails, setMyVidDetails] = useState([]);
    const [output, setOutput] = useState(null);

    const extractVideoId = (link) => {
        const regex = /(?:v=)([^&]+)/;
        const match = link.match(regex);
        return match ? match[1] : null;
    };
    const passAllData = async () => {
        try {
            let vidDetails = await fetchDetails();
            console.log(vidDetails);
            let aiOutput = await axios.post(`http://localhost:5000/gpt-api-call`, { vidDetails, myVidDetails });
            setOutput(aiOutput.data);
            console.log("Output", aiOutput.data);
        }
        catch (error) {
            console.error('Failed to send data', error);
        }
    };
    const fetchDetails = async () => {
        const videoId = extractVideoId(videoLink);
        try {
            const response = await axios.get(`http://localhost:5000/videoDetails?videoId=${videoId}`);
            setVideoDetails(response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch video details:', error);
        }
    };
    

    
    useEffect(() => {
        fetch("/my-video-details")
        .then((response) => response.json())
        .then((data) => setMyVidDetails(data))
        .catch((error) => console.error("Error fetching video titles:", error));
    }, []);


    return (
        <div className="">
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
        <h2>{ output }</h2>
        </div>
    );
};

export default InspirationEngine;