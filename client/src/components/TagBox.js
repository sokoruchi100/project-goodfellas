import React, { useState } from "react";

function TagBox({ tags, setTags }) {
  const [currentTag, setCurrentTag] = useState("");

  const addTag = (e) => {
    e.preventDefault();
    const newTag = currentTag;
    if (newTag && tags.length < 10) {
      setTags([...tags, newTag]);
    }
  };

  const deleteTag = (e, index) => {
    e.preventDefault();
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleCurrentTagChange = (e) => {
    setCurrentTag(e.target.value);
  };

  return (
    <div>
      <div className="flex flex-wrap">
        {tags &&
          tags.map((tag, index) => (
            <span key={index} className="Tag">
              {tag}
              <button
                className="border-none bg-none font-bold"
                onClick={(e) => deleteTag(e, index)}
              >
                X
              </button>
            </span>
          ))}
      </div>
      {tags && tags.length < 5 && (
        <div>
          <input
            className="bg-yellow-200 text-black px-1 rounded-full w-2/5"
            type="text"
            placeholder="Add a tag"
            onChange={(e) => handleCurrentTagChange(e)}
          />
          <button
            className="ml-1 text-base bg-sky-700 px-3 py-0 text-white"
            onClick={addTag}
          >
            Enter
          </button>
        </div>
      )}
    </div>
  );
}

export default TagBox;
