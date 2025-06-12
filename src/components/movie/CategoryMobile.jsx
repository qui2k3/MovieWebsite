import React, { useState, useEffect, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const CategoryMobile = ({ data, onClose }) => {
  const { title, genres, slug } = data;
  const [isOpen, setIsOpen] = useState(false); // State để điều khiển <details>
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Ref cho <details>

  const handleSummaryClick = (event) => {
    event.preventDefault(); // Ngăn <details> tự động toggle
    event.stopPropagation(); // Ngăn sự kiện click lan truyền lên trên (ví dụ: đến <details> chính của Header)

    setIsOpen(!isOpen); // Tự mình điều khiển trạng thái mở/đóng
  };

  // --- Hàm xử lý khi click vào một mục trong dropdown con ---
  const handleCategoryClick = (genre, index) => {
    if (title === "Thể loại") {
      if (slug && slug[index]) {
        navigate(`/the-loai/${slug[index]}`);
      } else {
        console.warn(
          `Slug not found for category: ${genre} at index ${index}. Navigating to a fallback.`
        );
        navigate(`/the-loai/khong-xac-dinh`);
      }
    } else if (title === "Quốc gia") {
      navigate(`/quoc-gia/${slug[index]}`);
    }
    setIsOpen(false); // ✅ Đóng dropdown con sau khi chọn mục
    if (onClose) {
      // Gọi hàm `onClose` từ Header để đóng menu mobile chính
      onClose();
    }
  };

  return (
    // ✅ Sử dụng <details> và `open={isOpen}` để React kiểm soát
    <details
      ref={dropdownRef}
      open={isOpen} // React kiểm soát thuộc tính 'open'
      className="w-full text-left" // Chiếm toàn bộ chiều rộng trong menu mobile
    >
      {/* ✅ <summary> để kích hoạt dropdown */}
      <summary
        className={`list-none cursor-pointer flex justify-between items-center text-[18px] text-white font-sans fw-black text-shadow py-2 w-full text-left
          ${isOpen ? "text-green-400" : "text-white"}
        `}
        onClick={handleSummaryClick} // Xử lý click để toggle
        aria-expanded={isOpen}
      >
        {title}
        {/* Icon mũi tên xoay */}
        <svg
          className={`ml-1 inline w-4 h-4 transition-transform duration-200 ${
            isOpen ? "" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </summary>

      {/* Dropdown Content - Chỉ hiển thị khi mở, dùng max-h để đẩy */}
      <div
        className={`bg-transparent rounded-md shadow-lg ring-1 ring-black/5 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? "max-h-screen py-2" : "max-h-0"}
          mt-2 w-full 
          ${title === "Thể loại" ? "grid grid-cols-5 " : ""}
          ${title === "Quốc gia" ? "grid grid-cols-3" : ""} 
        `}
      >
        {genres.map((genre, index) => (
          <div key={genre} className="py-1 cursor-pointer ">
            <div
              className="block px-4 py-2 text-sm text-white "
              onClick={() => handleCategoryClick(genre, index)}
            >
              {genre}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
};

export default CategoryMobile;
