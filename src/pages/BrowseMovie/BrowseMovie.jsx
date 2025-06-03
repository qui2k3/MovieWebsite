import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const BrowseMovie = ({ type }) => {
  const { genre, country } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (location.state?.movies) {
      setMovies(location.state.movies); // ✅ Cập nhật danh sách phim khi tìm kiếm mới
      return;
    }

    let apiUrl = "";
    if (type === "genre") {
      apiUrl = `https://phimapi.com/v1/api/the-loai/${genre}?page=1&limit=64`;
      console.log("type api genre");
    } else if (type === "country") {
      apiUrl = `https://phimapi.com/v1/api/quoc-gia/${country}?page=1&limit=64`;
      console.log("type api country");
    } else if (type === "phim-bo") {
      apiUrl = `https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&limit=64`;
      console.log("type api phim-bo");
    } else if (type === "phim-le") {
      apiUrl = `https://phimapi.com/v1/api/danh-sach/phim-le?page=1&limit=64`;
      console.log("type api phim-le");
    } else if (type === "tv-shows") {
      apiUrl = `https://phimapi.com/v1/api/danh-sach/tv-shows?page=1&limit=64`;
      console.log("type api tv-shows");
    } else if (type === "hoat-hinh") {
      apiUrl = `https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&limit=64`;
      console.log("type api hoat-hinh");
    } else {
      apiUrl = `https://phimapi.com/v1/api/danh-sach/${type}?page=1&limit=64`;
      console.log("type api search");
    }

    axios
      .get(apiUrl)
      .then((response) => {
        type !== "search"
          ? setMovies(response.data.data.items || [])
          : setMovies(response.data.items || []);
      })
      .catch(() => {
        setMovies([]);
      });
    console.log("goi lai useeffect");
  }, [genre, country, type, location.state]); // ✅ Theo dõi location.state để cập nhật danh sách phim mới

  return (
    <div className="p-5 max-w-full mx-auto bg-[#010810]">
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {movies.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/phim/${item.slug}`)}
              className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden"
            >
              <img
                src={`https://phimimg.com/${item.poster_url}`}
                className="w-full h-full object-cover rounded-lg group-hover:scale-125 transition-transform duration-300"
                alt={item.name || "poster phim"}
              />
              <div className="absolute bottom-0 left-0 w-full h-1/5 flex flex-col justify-center text-center text-white leading-4 bg-[#080705] bg-opacity-60 p-1">
                <h3 className="block text-center font-semibold px-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name}
                </h3>
                <span className="block text-center font-light text-sm px-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.origin_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-white">Không tìm thấy phim.</p>
      )}
    </div>
  );
};

export default BrowseMovie;
