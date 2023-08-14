import React, { useState } from "react";

function TagBox({ tags, setTags, amount }) {
  const [currentTag, setCurrentTag] = useState("");

  const addTag = (e) => {
    e.preventDefault();
    const newTag = currentTag.toLowerCase().replace(/\s/g, "");
    if (newTag && tags.length < amount) {
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
                className="border-none bg-none font-normal bg-transparent"
                onClick={(e) => deleteTag(e, index)}
              >
                X
              </button>
            </span>
          ))}
      </div>
      {tags && tags.length < amount && (
        <div className="relative h-1/3 flex flex-row items-center mt-1 w-64">
          <input
            className="w-full bg-yellow-200 text-base text-black px-1 rounded-full placeholder:text-black font-semibold"
            type="text"
            placeholder="Add a tag"
            onChange={(e) => handleCurrentTagChange(e)}
          />
          <button
            className="absolute right-2 text-2xl border-none bg-transparent p-0 text-black"
            onClick={addTag}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default TagBox;
