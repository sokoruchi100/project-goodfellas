import React, { useState } from "react";

function ImageUpload({ imageUrl, setImageUrl }) {
  const handleUpload = async (e) => {
    const selectedImage = e.target.files[0];
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
    } catch (error) {
      console.error("There was an error uploading the image", error);
    }
  };

  return (
    <div>
      {/* Handle the form submission here */}
      <input type="file" onChange={handleUpload} />
      {imageUrl && <img src={imageUrl} alt="Uploaded preview" />}
    </div>
  );
}

export default ImageUpload;
