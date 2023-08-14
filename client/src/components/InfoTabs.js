import React, { useState } from "react";

const tabsData = [
  {
    title: "Using Your Videos",
    content:
      "Input 4 of your own videos for the artificial intelligence to analyze. All new ideas are personalized around your content, making sure that each idea is still grounded within your content.Content for Tab 1",
    imageUrl: "path/to/image1.jpg",
  },
  {
    title: "Using Other Videos",
    content:
      "The Inspiration Engine will use content that is similar to yours to help create an idea for you. ",
    imageUrl: "path/to/image2.jpg",
  },
  {
    title: "Answering Questions",
    content:
      "To get a better idea of what type of content you would like, you will be prompted to answer a few questions.",
    imageUrl: "path/to/image3.jpg",
  },
  {
    title: "Final Product",
    content:
      "Your idea will be generated along with a video, description, keywords, and similar videos that already exist. You also have the options to save it to your vault, or share it with a community!",
    imageUrl: "path/to/image4.jpg",
  },
];

function InfoTabs() {
  const [activeTab, setActiveTab] = useState(0); // default to the first tab

  return (
    <div className="infoTabs w-3/4 flex h-1/2 mt-20">
      <div className="tabs w-1/4">
        {tabsData.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`flex flex-row items-center rounded-2xl font-urbanist tab py-2 px-4 cursor-pointer ${
              index === activeTab ? "bg-gray-800" : "bg-gray-600"
            }`}
          >
            <div className="bg-sky-700 rounded-full h-10 w-10 p-2 mr-2 flex justify-center items-center">
              <span className="text-white text-3xl">{index + 1}</span>
            </div>
            <h3 className="text-white text-2xl">{tab.title}</h3>
          </div>
        ))}
      </div>
      <div className="flex flex-row content w-3/4 p-4 bg-gray-800 rounded-2xl h-full">
        <p className="font-roboto w-1/2">{tabsData[activeTab].content}</p>
        <img
          src={tabsData[activeTab].imageUrl}
          alt={tabsData[activeTab].title}
          className="mb-4 w-1/2"
        />
      </div>
    </div>
  );
}

export default InfoTabs;
