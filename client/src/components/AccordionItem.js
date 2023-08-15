import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function AccordionItem({ title, content }) {
  //console.log(title, content);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 mb-2 rounded-xl shadow p-4">
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-yellow-200 font-bold text-3xl">{title}</div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-white text-xl transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="p-3 text-xl font-bold text-white">{content}</div>
      )}
    </div>
  );
}

export default AccordionItem;
