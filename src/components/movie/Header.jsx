import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Catergory from "./Catergory";
const ListLink = [
  {
    id: 1,
    to: "/",
    title: "Phim bộ",
  },
  {
    id: 2,
    to: "/phimle",
    title: "Phim lẻ",
  },
  {
    id: 3,
    to: "/tvshows",
    title: "TV Shows",
  },
  {
    id: 4,
    to: "/hoathinh",
    title: "Hoạt hình",
  },
];
const categoryProps = {
  title: "Thể loại",
  genres: [
    "Hành Động",
    "Cổ Trang",
    "Chiến Tranh",
    "Viễn Tưởng",
    "Kinh Dị",
    "Tài Liệu",
    "Bí Ẩn",
    "Phim 18+",
    "Tình Cảm",
    "Tâm Lý",
    "Thể Thao",
    "Phiêu Lưu",
    "Âm Nhạc",
    "Gia Đình",
    "Học Đường",
    "Hài Hước",
    "Hình Sự",
    "Võ Thuật",
    "Khoa Học",
    "Thần Thoại",
    "Chính Kịch",
    "Kinh Điển",
  ],
};
const countryProps = {
  title: "Quốc gia",
  genres: ["Trung Quốc", "Hàn Quốc", "Âu Mỹ", "Nhật Bản", "Việt Nam"],
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`w-full h-14 flex justify-between items-center z-50 ${
        isScrolled ? "bg-black fixed" : "absolute"
      }`}
    >
      <div className="flex h-full justify-between items-center font-bold">
        <a
          href=""
          className="flexjustify-between items-center text-[24px] text-white fw-black px-2 "
        >
          <NavLink to={"/"}>
            <h1 className="text-center text-shadow text-4xl">MọtPhim</h1>
          </NavLink>
        </a>
        <div className="relative ml-5">
          <input
            className=" h-10 w-[280px] pl-[40px] outline-none bg-[#5b4a40] rounded-md text-white"
            placeholder="Tìm kiếm phim, diễn viên"
          ></input>
          <div className="absolute w-5 h-5 top-[25%] left-[3%] ">
            <img src="/search-icon.svg" alt="search-icon"></img>
          </div>
        </div>
      </div>
      <div>
        <ul className="flex gap-6 px-5  text-[18px] text-white fw-black text-shadow">
          <li>
            <Catergory data={categoryProps}></Catergory>
          </li>
          {ListLink.map((item) => {
            return (
              <li>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? "border-b-2" : "")}
                >
                  {item.title}
                </NavLink>
              </li>
            );
          })}
          <li>
            <Catergory data={countryProps}></Catergory>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
