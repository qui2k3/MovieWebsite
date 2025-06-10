import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import MovieCard, { MovieCardSkeleton } from "../../components/movie/MovieCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BrowseMovie = ({ type }) => {
  const { genre, country, query } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = useCallback(
    async (page) => {
      setLoading(true);
      let apiUrl = "";
      const limit = 30;

      if (type === "search") {
        if (!query) {
          setMovies([]);
          setTotalPages(0);
          setLoading(false);
          return;
        }
        apiUrl = `https://phimapi.com/v1/api/tim-kiem?keyword=${query}&page=${page}&limit=${limit}`;
      } else if (type === "genre") {
        apiUrl = `https://phimapi.com/v1/api/the-loai/${genre}?page=${page}&limit=${limit}`;
      } else if (type === "country") {
        apiUrl = `https://phimapi.com/v1/api/quoc-gia/${country}?page=${page}&limit=${limit}`;
      } else {
        apiUrl = `https://phimapi.com/v1/api/danh-sach/${type}?page=${page}&limit=${limit}`;
      }

      try {
        const response = await axios.get(apiUrl);
        setMovies(response.data?.data?.items || []);
        setTotalPages(response.data?.data?.params?.pagination?.totalPages || 0);
      } catch (error) {
        console.error("Lỗi API:", error);
        setMovies([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    },
    [genre, country, query, type]
  );

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1");
    if (pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
    fetchMovies(pageFromUrl);
  }, [genre, country, query, type, fetchMovies, searchParams]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxPageButtons = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 rounded-md bg-gray-700 text-white hover:bg-gray-600"
        >
          Trang trước
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md ${
            i === currentPage
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 rounded-md bg-gray-700 text-white hover:bg-gray-600"
        >
          Trang sau
        </button>
      );
    }

    return (
      <div className="flex flex-wrap justify-center items-center gap-2 p-4 overflow-x-auto">
        {pages}
      </div>
    );
  };

  return (
    <div className="p-5 max-w-full mx-auto bg-[#010810] min-h-screen">
      {totalPages > 1 && (
        <div className="flex justify-center mb-4 p-4">
          {renderPaginationButtons()}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-5">
            {movies.map((item) => (
              <MovieCard
                key={item._id}
                movie={item}
                thisForUrlImageMovieLastest={false}
                showNameOnHover={false}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 p-4">
              {renderPaginationButtons()}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-white text-lg">Không tìm thấy phim.</p>
      )}
    </div>
  );
};

export default BrowseMovie;
