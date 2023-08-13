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
    <div className="relative">
      <label className="cursor-pointer">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="h-32 w-32 border border-white rounded-full"
          />
        ) : (
          <div className="h-32 w-32 bg-gray-800 border border-white rounded-full flex items-center justify-center">
            <span className="text-white text-6xl">+</span>
          </div>
        )}
        <input type="file" className="hidden" onChange={handleUpload} />
      </label>
    </div>
  );
}

export default ImageUpload;
