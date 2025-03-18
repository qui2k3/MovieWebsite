import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Catergory from "./Catergory";
import { ListLink, categoryProps, countryProps } from "../../contants/menuData";

// const ListLink = [
//   { id: 1, to: "/", title: "Phim bộ" },
//   { id: 2, to: "/movie", title: "Phim lẻ" },
//   { id: 3, to: "/tvshows", title: "TV Shows" },
//   { id: 4, to: "/hoathinh", title: "Hoạt hình" },
// ];
// const categoryProps = {
//   title: "Thể loại",
//   genres: [
//     "Hành Động",
//     "Cổ Trang",
//     "Chiến Tranh",
//     "Viễn Tưởng",
//     "Kinh Dị",
//     "Tài Liệu",
//     "Bí Ẩn",
//     "Phim 18+",
//     "Tình Cảm",
//     "Tâm Lý",
//     "Thể Thao",
//     "Phiêu Lưu",
//     "Âm Nhạc",
//     "Gia Đình",
//     "Học Đường",
//     "Hài Hước",
//     "Hình Sự",
//     "Võ Thuật",
//     "Khoa Học",
//     "Thần Thoại",
//     "Chính Kịch",
//     "Kinh Điển",
//   ],
// };
// const countryProps = {
//   title: "Quốc gia",
//   genres: ["Trung Quốc", "Hàn Quốc", "Âu Mỹ", "Nhật Bản", "Việt Nam"],
// };
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <header
        className={`w-full h-auto p-2 flex justify-between items-start z-50 ${
          isHomePage
            ? isScrolled
              ? "bg-black fixed"
              : "absolute bg-transparent"
            : isScrolled
            ? "fixed bg-black"
            : "bg-black )"
        } `}
      >
        <div className="flex h-full justify-between items-start pt-1 font-bold">
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
          <ul className="flex gap-6 px-5 text-[18px] text-white fw-black text-shadow">
            <li>
              <Catergory data={categoryProps}></Catergory>
            </li>
            {ListLink.map((item) => {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    className="hover:text-green-400 transition-all duration-200"
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
      {location.pathname === "/" && (
        <section className="banner w-full h-screen bg-white">
          <div className="w-full h-full relative">
            <img
              src="../../bg-homepage.jpg"
              alt="img-dau"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-5 left-[13%]  w-max text-white">
              <h2 className="font-bold text-3xl mb-5">Avengers: Endgame</h2>
              <div className="flex font-semibold items-center gap-x-3 mb-8">
                <span className="py-2 px-4 border border-white rounded-md">
                  Hành động
                </span>
              </div>
              <button className="py-3 px-6 rounded-lg text-white font-semibold bg-pink-600">
                Xem Ngay
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default Header;
