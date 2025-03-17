import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Catergory = (props) => {
  const { title, genres } = props.data;
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="inline-block w-[78px] h-[28px] text-center gap-x-1.5 font-semibold shadow-xs outline-none text-[18px] text-white font-sans fw-black text-shadow bg-transparent cursor-pointer">
        {title}
      </span>
      <div
        className={`absolute bg-transparent -mt-1 grid grid-cols-3 right-0 z-10 w-96 origin-top-right rounded-md  shadow-lg ring-1 ring-black/5 backdrop-blur-md transition ${
          isOpen ? "block" : "hidden"
        }`}
        onMouseLeave={handleMouseLeave}
      >
        {genres.map((genre, index) => (
          <div key={index} className="py-1 cursor-pointer">
            <div className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900">
              {genre}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catergory;
