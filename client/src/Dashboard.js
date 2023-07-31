import React, { useEffect, useState } from "react";

function Dashboard() {
  const [videoTitles, setVideoTitles] = useState([]);

  useEffect(() => {
    fetch("/api/videos")
      .then((response) => response.json())
      .then((data) => setVideoTitles(data))
      .catch((error) => console.error("Error fetching video titles:", error));
  }, []);

  return (
    <div>
      <h1>VIDEOS</h1>
      <ul>
        {videoTitles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
