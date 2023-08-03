import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Dashboard() {
  const [videoTitles, setVideoTitles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((response) => response.json())
      .then((data) => setVideoTitles(data))
      .catch((error) => console.error("Error fetching video titles:", error));
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // You can use FileReader to read the selected image and display it on the screen
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>VIDEOS</h1>
      <ul>
        {videoTitles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>

      {/* Button to trigger image selection*/}
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {/* Display selected Image */}
      {selectedImage && (
        <div>
          <h2>Selected Profile Picture:</h2>
          <img
            src={selectedImage}
            alt="Selected Profile"
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
