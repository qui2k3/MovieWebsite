import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import CategoryDesktop from "./CategoryDesktop";
import CategoryMobile from "./CategoryMobile";
import { ListLink, categoryProps, countryProps } from "../../contants/menuData";
import useDebounce from "../hooks/useDebounce";

// Import các hàm cần thiết từ file cấu hình Firebase của bạn
import {
  signInWithFacebook,
  signOutUser,
  onAuthChange,
} from "../../configs/firebaseConfig";

// === START: THÊM IMPORTS CHO FONT AWESOME ===
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faHistory,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons"; // Chọn các icon bạn muốn dùng
// Lưu ý: Nếu bạn dùng Font Awesome 6, các icon có thể có tên mới như faArrowRightToBracket, faArrowRightFromBracket, faClockRotateLeft
// Ví dụ: import { faArrowRightToBracket, faArrowRightFromBracket, faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
// và sử dụng icon={faArrowRightToBracket}
// === END: THÊM IMPORTS CHO FONT AWESOME ===

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [filter, setFilter] = useState("");
  const filterDebounce = useDebounce(filter, 500);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  // === START: CODE MỚI CHO XÁC THỰC FIREBASE ===
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const handleLogin = async () => {
    try {
      await signInWithFacebook();
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsUserMenuOpen(false);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    navigate("/");
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleViewHistory = () => {
    closeUserMenu();
    navigate("/lich-su-xem");
  };
  // === END: CODE MỚI CHO XÁC THỰC FIREBASE ===

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
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
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-6 px-5 text-[18px] text-white fw-black text-shadow">
            <li>
              <CategoryDesktop data={categoryProps} />
            </li>
            <li>
              <CategoryDesktop data={countryProps} />
            </li>
            {/* Duyệt qua ListLink, xử lý riêng mục Đăng nhập */}
            {ListLink.map((item) => (
              <li key={item.id}>
                {item.to === "/dang-nhap" ? (
                  // === START: THAY THẾ LINK ĐĂNG NHẬP BẰNG AVATAR/DROPDOWN (DESKTOP) ===
                  loadingAuth ? (
                    <span className="text-white">Đang tải...</span>
                  ) : user ? (
                    <div className="relative" ref={userMenuRef}>
                      {" "}
                      <img
                        src={user.photoURL || "/default-avatar.png"}
                        alt={user.displayName || "User Avatar"}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-blue-400 transition-colors duration-200"
                        onClick={toggleUserMenu}
                        title={user.displayName || user.email || "Người dùng"}
                      />
                      {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-2 z-50 animate-fadeIn">
                          {" "}
                          <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700 truncate">
                            {user.displayName || user.email || "Người dùng"}
                          </div>
                          <button
                            onClick={handleViewHistory}
                            className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                          >
                            <FontAwesomeIcon
                              icon={faHistory}
                              className="mr-2"
                            />
                            Lịch sử xem phim
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 text-sm"
                          >
                            <FontAwesomeIcon
                              icon={faSignOutAlt}
                              className="mr-2"
                            />
                            Đăng xuất
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleLogin}
                      className="py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                      title="Đăng nhập bằng Facebook"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                      Đăng nhập
                    </button>
                  )
                ) : (
                  // === END: THAY THẾ LINK ĐĂNG NHẬP BẰNG AVATAR/DROPDOWN (DESKTOP) ===
                  <NavLink
                    to={item.to}
                    className="hover:text-green-400 transition-all duration-200"
                  >
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Hamburger Icon cho Mobile (Giữ nguyên) */}
        <button
          className="lg:hidden text-white p-2 focus:outline-none z-50"
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

      {/* Mobile Menu Overlay (Giữ nguyên) */}
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
          <div className="flex justify-between items-center mb-6">
            {/* Có thể thêm logo hoặc tên ứng dụng ở đây */}
          </div>

          {/* Input tìm kiếm trong Mobile Menu (Giữ nguyên) */}
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
            {/* Sửa LI cho CategoryMobile (Thể loại) */}
            <li className="pb-4 border-b border-gray-700">
              {" "}
              {/* Thêm pb-4, border-b, border-gray-700 */}
              <CategoryMobile data={categoryProps} onClose={closeMobileMenu} />
            </li>
            {/* Sửa LI cho CategoryMobile (Quốc gia) */}
            <li className="pb-4 border-b border-gray-700">
              {" "}
              {/* Thêm pb-4, border-b, border-gray-700 */}
              <CategoryMobile data={countryProps} onClose={closeMobileMenu} />
            </li>
            {/* Duyệt qua ListLink, sửa các LI */}
            {ListLink.map((item, index) => (
              <li
                key={item.id}
                className={`${
                  index < ListLink.length - 1
                    ? "pb-4 border-b border-gray-700"
                    : ""
                }`}
              >
                {item.to === "/dang-nhap" ? (
                  // === START: THAY THẾ LINK ĐĂNG NHẬP BẰNG NÚT ĐỘNG (MOBILE) ===
                  loadingAuth ? (
                    <span className="text-white py-2">Đang tải...</span>
                  ) : user ? (
                    <div className="flex flex-col gap-2 py-2">
                      <span className="text-white text-base">
                        Xin Chào:{" "}
                        {user.displayName || user.email || "Người dùng"} !
                      </span>
                      <button
                        onClick={handleViewHistory}
                        className="flex items-center w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors duration-200 text-sm"
                      >
                        <FontAwesomeIcon icon={faHistory} className="mr-2" />
                        Lịch sử xem phim
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 text-sm"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <li className="w-full">
                      <button
                        onClick={handleLogin}
                        className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 flex justify-center items-center w-full"
                        title="Đăng nhập bằng Facebook"
                      >
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                        Đăng nhập
                      </button>
                    </li>
                  )
                ) : (
                  // === END: THAY THẾ LINK ĐĂNG NHẬP BẰNG NÚT ĐỘNG (MOBILE) ===
                  // Các NavLink thông thường cho mobile
                  <NavLink
                    to={item.to}
                    onClick={closeMobileMenu}
                    className="block py-2 transition-all duration-200 rounded-md"
                  >
                    {item.title}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Phần banner và nội dung khác (giữ nguyên từ code của bạn) */}
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
