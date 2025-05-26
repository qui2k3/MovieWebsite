import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const BrowseMovie = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const moviesFromSerch = location.state?.filter || ""; // Sử dụng "" thay vì []
  const { tongHop = "phim-bo" } = useParams();
  const [movies, setMovies] = useState([]);
  const [nextPage, setNextPage] = useState(1);

  const getMovies = () => {
    if (moviesFromSerch && moviesFromSerch.trim() !== "") {
      // Gọi API tìm kiếm nếu có từ khóa
      return axios
        .get(
          `https://phimapi.com/v1/api/tim-kiem?keyword=${moviesFromSerch}&page=1&sort_field=_id&sort_type=asc&year=2024&limit=10`
        )
        .then((response) => {
          console.log(response.data.data.items);
          return response.data.data.items || []; // Trả về mảng rỗng nếu không có items
        })
        .catch((error) => {
          console.log("Lỗi khi gọi API tìm kiếm:", error);
          return []; // Trả về mảng rỗng nếu có lỗi
        });
    }

    // Nếu không có từ khóa, gọi API danh sách mặc định
    return axios
      .get(
        `https://phimapi.com/v1/api/danh-sach/${tongHop}?&page=${nextPage}&sort_field=_id&sort_type=asc&limit=64`
      )
      .then((response) => {
        console.log(response.data.data.items);
        return response.data.data.items || []; // Trả về mảng rỗng nếu không có items
      })
      .catch((error) => {
        console.log("Lỗi khi gọi API danh sách:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
      });
  };

  useEffect(() => {
    getMovies().then((movies) => {
      setMovies(movies); // Cập nhật danh sách phim
    });
  }, [tongHop, moviesFromSerch]); // Thêm moviesFromSerch vào mảng phụ thuộc

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 p-5 gap-5 max-w-full mx-auto bg-[#010810]">
      {movies.length > 0 &&
        movies.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/DangXemThongTinPhim/${item.slug}`)}
            className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden"
          >
            <img
              src={`https://phimimg.com/${item.poster_url}`}
              className="w-full h-full object-cover rounded-lg group-hover:scale-125 transition-transform duration-300"
              alt="poster"
            />
            <div className="relative -translate-y-full w-auto h-1/5 flex flex-col justify-center items-center text-center text-white leading-4 bg-[#080705] bg-opacity-60">
              <h3 className="block text-center font-semibold">{item.name}</h3>
            </div>
          </div>
        ))}
    </div>
  );
};

export default BrowseMovie;