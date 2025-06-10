import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const CategoryDesktop = ({ data }) => {
  const { title, genres, slug } = data; // ✅ Thêm `slug` cho thể loại
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Dùng để chuyển hướng

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const handleCategoryClick = (genre, index) => {
    if (title === "Thể loại") {
      navigate(`/the-loai/${slug[index]}`); // ✅ Chuyển hướng theo slug của thể loại
    } else if (title === "Quốc gia") {
      const countrySlug = genre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-"); // ✅ Tạo slug cho quốc gia
      navigate(`/quoc-gia/${countrySlug}`); // ✅ Chuyển hướng theo quốc gia
    }
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`inline-block w-[78px] h-[28px] text-center gap-x-1.5 font-semibold shadow-xs outline-none text-[18px] text-white font-sans fw-black text-shadow bg-transparent cursor-pointer
       ${isOpen ? "text-green-400" : "text-white"}`}
      >
        {title}
      </span>
      <div
        className={`absolute bg-transparent -mt-1 grid grid-cols-3 right-0 z-10 w-96 origin-top-right rounded-md shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-opacity duration-700 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {genres.map((genre, index) => (
          <div key={index} className="py-1 cursor-pointer">
            <div
              className="block px-4 py-2 text-sm text-white hover:bg-gray-100 hover:text-gray-900"
              onClick={() => handleCategoryClick(genre, index)} // ✅ Kiểm tra title trước khi chuyển hướng
            >
              {genre}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryDesktop;
