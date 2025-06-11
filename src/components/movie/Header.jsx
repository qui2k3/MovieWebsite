import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom"; // Thêm NavLink
import CategoryDesktop from "./CategoryDesktop";
import CategoryMobile from "./CategoryMobile"; // Import CategoryMobile
import { ListLink, categoryProps, countryProps } from "../../contants/menuData";
import useDebounce from "../hooks/useDebounce";
// import axios from "axios"; // Không sử dụng axios trực tiếp ở đây nữa

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [filter, setFilter] = useState("");
  const filterDebounce = useDebounce(filter, 500); // Giữ nguyên debounce cho search
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // State mới để quản lý trạng thái mở/đóng của menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // State để theo dõi kích thước màn hình
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  // Effect để theo dõi kích thước màn hình và scroll
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
      // Nếu chuyển sang màn hình lớn, đóng menu mobile
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    const sanitizedValue = value.replace(/[^a-zA-Z0-9À-ỹ\s]/g, "");
    setFilter(sanitizedValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && filter.trim()) {
      navigate(`/tim-kiem/${filter.trim()}`);
      setFilter("");
      // Đóng menu mobile sau khi tìm kiếm (nếu đang mở)
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`w-full h-auto p-2 flex flex-row justify-between items-center z-50 transition-colors duration-300
          ${
            isHomePage
              ? isScrolled
                ? "bg-black relative lg:fixed"
                : "lg:absolute lg:bg-transparent bg-black"
              : isScrolled
              ? "lg:fixed bg-black"
              : "bg-black"
          }`}
      >
        <div className="flex h-full items-center font-bold">
          {/* Logo */}
          <NavLink to={"/"} onClick={closeMobileMenu} className="flex-shrink-0">
            <h1 className="text-center text-shadow text-4xl text-white px-2">
              MọtPhim
            </h1>
          </NavLink>

          {/* Input tìm kiếm cho Desktop */}
          <div className="relative ml-5 hidden lg:block">
            <input
              className="h-10 max-w-[280px] pl-[40px] outline-none bg-[#5b4a40] rounded-md text-white"
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

        {/* Menu Desktop */}
        <div className="hidden lg:block">
          <ul className="flex items-center gap-6 px-5 text-[18px] text-white fw-black text-shadow">
            <li>
              <CategoryDesktop data={categoryProps} />
            </li>
            <li>
              <CategoryDesktop data={countryProps} />
            </li>
            {ListLink.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className="hover:text-green-400 transition-all duration-200"
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Hamburger Icon cho Mobile */}
        <button
          className="lg:hidden text-white p-2 focus:outline-none z-50" // z-index để icon nằm trên overlay
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Sidebar */}
      <nav
        className={`fixed top-0 left-0 h-full w-96 bg-[#010810] z-50 transform transition-transform duration-300 ease-in-out lg:hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Header trong Mobile Menu (có thể thêm logo hoặc đóng button nếu muốn) */}
          <div className="flex justify-between items-center mb-6">
            {/* <h2 className="text-white text-2xl font-bold">Menu</h2> */}
            {/* Nếu muốn, có thể thêm nút đóng riêng ở đây */}
            {/* <button onClick={closeMobileMenu} className="text-white">X</button> */}
          </div>

          {/* Input tìm kiếm trong Mobile Menu */}
          <div className="relative mb-6">
            <input
              className="h-10 w-full pl-[40px] outline-none bg-[#5b4a40] rounded-md text-white"
              placeholder="Tìm kiếm phim"
              value={filter}
              onInput={handleFilterChange}
              onKeyDown={handleKeyPress}
            ></input>
            <div className="absolute w-5 h-5 top-[25%] left-[3%]">
              <img src="/search-icon.svg" alt="search-icon"></img>
            </div>
          </div>

          {/* Các Link và Category cho Mobile */}
          <ul className="flex flex-col gap-4 text-[18px] text-white fw-black text-shadow overflow-y-auto pb-4">
            <li>
              <CategoryMobile data={categoryProps} onClose={closeMobileMenu} />
            </li>
            <li>
              <CategoryMobile data={countryProps} onClose={closeMobileMenu} />
            </li>
            {ListLink.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  onClick={closeMobileMenu} // Đóng menu khi click vào link
                  className="block py-2 transition-all duration-200 rounded-md"
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

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
