import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import CategoryDesktop from "./CategoryDesktop";
import CategoryMobile from "./CategoryMobile";
import { ListLink, categoryProps, countryProps } from "../../contants/menuData";
import useDebounce from "../hooks/useDebounce";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [filter, setFilter] = useState("");
  const filterDebounce = useDebounce(filter, 500);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Không cần state `movies` ở đây nữa vì `BrowseMovie` sẽ tự gọi API.
  // const [movies, setMovies] = useState([]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9À-ỹ\s]/g, "");
    setFilter(sanitizedValue);
  };

  // Logic gọi API getMovies không cần ở đây nữa, sẽ chuyển sang BrowseMovie

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filter.trim()) {
      // Kiểm tra filter có giá trị để tránh navigate với chuỗi rỗng
      navigate(`/tim-kiem/${filter.trim()}`); // Chỉ chuyển hướng, không truyền state movies nữa
      setFilter(""); // Xóa input sau khi tìm kiếm
    }
  };

  return (
    <>
      <header
        className={`w-full h-auto p-2 flex flex-col lg:flex-row justify-between items-start z-50 ${
          isHomePage
            ? isScrolled
              ? "bg-black relative lg:fixed "
              : "lg:absolute lg:bg-transparent bg-black"
            : isScrolled
            ? "lg:fixed bg-black"
            : "bg-black "
        } `}
      >
        <div className="flex h-full justify-between items-start pt-1 font-bold">
          <a
            href=""
            className="flex justify-between items-center text-[24px] text-white fw-black px-2 "
          >
            <NavLink to={"/"}>
              <h1 className="text-center text-shadow text-4xl">MọtPhim</h1>
            </NavLink>
          </a>
          <div className="relative ml-5">
            <input
              className=" h-10 max-w-[280px] pl-[40px] outline-none bg-[#5b4a40] rounded-md text-white"
              placeholder="Tìm kiếm phim"
              value={filter}
              onInput={handleFilterChange}
              onKeyDown={handleKeyPress}
            ></input>
            <div className="absolute w-5 h-5 top-[25%] left-[3%] ">
              <img src="/search-icon.svg" alt="search-icon"></img>
            </div>
          </div>
        </div>

        <div>
          <ul className="flex flex-col lg:flex-row items-baseline gap-6 px-5 text-[18px] text-white fw-black text-shadow">
            <li className=" hidden lg:block">
              <CategoryDesktop data={categoryProps}></CategoryDesktop>
            </li>
            <li className=" hidden lg:block">
              <CategoryDesktop data={countryProps}></CategoryDesktop>
            </li>
            <li className=" block lg:hidden">
              <CategoryMobile data={categoryProps}></CategoryMobile>
            </li>
            <li className=" block lg:hidden">
              <CategoryMobile data={countryProps}></CategoryMobile>
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
            <div className="absolute inset-0 flex items-center justify-center text-white ">
              <h2 className="font-bold text-[32px] lg:text-[55px] mb-5 w-[470px] text-center">
                Phim, series không giới hạn và nhiều nội dung khác
              </h2>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
export default Header;
