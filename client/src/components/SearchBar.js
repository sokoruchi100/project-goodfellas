import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ searchTags, setSearchTags, handleSearch }) => {
  const handleSearchTagsChange = (e) => {
    setSearchTags(e.target.value);
  };

  return (
    <div className="relative w-2/3 h-10">
      <input
        type="text"
        value={searchTags}
        onChange={handleSearchTagsChange}
        placeholder="Search for keywords or tags"
        className="bg-white rounded-lg w-full h-full border border-black pl-4 text-base placeholder:text-gray-600" // optional CSS class for styling
      />
      <button
        className="p-0 absolute top-2 right-0 border-none bg-transparent cursor-pointer"
        onClick={handleSearch}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </div>
  );
};

export default SearchBar;
