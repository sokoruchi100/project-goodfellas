// TagBox.js

import React from "react";

function TagBox({ value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter tags separated by space"
    />
  );
}

export default TagBox;
