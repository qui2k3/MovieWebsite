import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Catergory from "./Catergory";
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
  // const handleCategoryClick = (genre) => {
  //   // Chuyển hướng tới BrowseMovie và truyền dữ liệu thể loại qua state
  //   navigate(`/TongHop/${genre}`, { state: { genre } });
  // };

  const handleFilterChange = (e) => {
  const value = e.target.value;

  // Chỉ cho phép chữ cái có dấu, số và khoảng trắng
  const sanitizedValue = value.replace(/[^a-zA-Z0-9À-ỹ\s]/g, ""); 

  setFilter(sanitizedValue); // Cập nhật state với giá trị hợp lệ
};




  const getMovies = () => {
    const searchUrl = `https://phimapi.com/v1/api/tim-kiem?keyword=${filterDebounce}&page=1`;
    return axios
      .get(searchUrl)
      .then((response) => {
        // console.log("Kết quả tìm kiếm:", response.data.data.items);
        return response.data.data.items;
      })
      .catch((error) => {
        console.log("Lỗi khi gọi api", error);
      });
  };
  // const handleGetKeyWordSearch = (e) => {
  //   console.log(e.target.value);
  // }
  // useEffect(() => {
  //   //neu co filter
  //   if (filterDebounce) {
  //     getMovies().then((data) => console.log("Danh sách phim:", data));
  //   }
  // }, [filterDebounce]);
  const [movies, setMovies] = useState([]);
  // useEffect(() => {
  //   if (filterDebounce) {
  //     getMovies().then((data) => {
  //       console.log("data:", data);
  //       setMovies(data || []);

  //     });
  //     // console.log("name",movies[0]?.name);  đã lấy được tên phim
  //   }
  // }, [filterDebounce]);
  useEffect(() => {
    if (filterDebounce.trim()) {
      getMovies().then((data) => {
        console.log("Danh sách phim:", data);
        setMovies(data || []); // Lưu kết quả tìm kiếm
      });
    }
  }, [filterDebounce]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && movies.length > 0) {
      navigate(`/tim-kiem/${filter}`, { state: { filter } }); // Chuyển hướng và truyền dữ liệu
    }
  };

  return (
    <>
      <header
        className={`w-full bg-black h-auto p-2 flex flex-col lg:flex-row justify-between items-start z-50 ${
          isHomePage
            ? isScrolled
              ? "bg-black fixed"
              : "lg:absolute lg:bg-transparent"
            : isScrolled
              ? "fixed bg-black"
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
              className=" h-10 w-[280px] pl-[40px] outline-none bg-[#5b4a40] rounded-md text-white"
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
          <ul className="flex items-baseline gap-6 px-5 text-[18px] text-white fw-black text-shadow">
            <li>
              <Catergory data={categoryProps}></Catergory>
            </li>
            <li>
              <Catergory data={countryProps}></Catergory>
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
