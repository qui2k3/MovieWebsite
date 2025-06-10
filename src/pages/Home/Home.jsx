// Home.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard, { MovieCardSkeleton } from "../../components/movie/MovieCard"; // Import MovieCardSkeleton
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import "react-loading-skeleton/dist/skeleton.css"; // Import CSS của skeleton

// Các lời gọi API giữ nguyên
const getThelatestMovies = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"
    );
    return response.data.items;
  } catch (error) {
    console.log("Lỗi API (phim mới nhất):", error);
    return [];
  }
};

const getTheCartoons = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&sort_field=_id&sort_type=asc&limit=20"
    );
    return response.data.data.items;
  } catch (error) {
    console.log("Lỗi API (hoạt hình):", error);
    return [];
  }
};

const getTheChinaMovies = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=_id&sort_type=asc&country=trung-quoc&limit=10"
    );
    return response.data.data.items;
  } catch (error) {
    console.log("Lỗi API (phim Trung Quốc):", error);
    return [];
  }
};

const getTheKoreanMovies = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=_id&sort_type=asc&country=han-quoc&limit=10"
    );
    return response.data.data.items;
  } catch (error) {
    console.log("Lỗi API (phim Hàn Quốc):", error);
    return [];
  }
};

const Home = () => {
  const navigate = useNavigate();
  const [moviesLastest, setMoviesMoiCapNhat] = useState([]);
  const [moviesChina, setMoviesChina] = useState([]);
  const [moviesKorean, setMoviesKorean] = useState([]);
  const [moviesCartoon, setMoviesCartoon] = useState([]);
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái tải

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true); // Đặt loading thành true trước khi fetch
      try {
        const [latestMovies, chinaMovies, koreanMovies, cartoons] =
          await Promise.all([
            getThelatestMovies(),
            getTheChinaMovies(),
            getTheKoreanMovies(),
            getTheCartoons(),
          ]);

        setMoviesMoiCapNhat(latestMovies || []);
        setMoviesChina(chinaMovies || []);
        setMoviesKorean(koreanMovies || []);
        setMoviesCartoon(cartoons || []);
      } catch (error) {
        console.error("Lỗi khi lấy phim:", error);
      } finally {
        setLoading(false); // Đặt loading thành false sau khi fetch (thành công hoặc lỗi)
      }
    };

    fetchMovies();
  }, []);

  const renderMovieSection = (title, movies) => (
    <section className="bg-[#010810] p-5 pt-10">
      <h2 className="text-[24px] pl-5 pb-5 text-white font-semibold ">
        {title}
      </h2>
      <Swiper
        grabCursor={true}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          1024: {
            slidesPerView: 5,
          },
        }}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <SwiperSlide key={index}>
                <MovieCardSkeleton />
              </SwiperSlide>
            ))
          : movies.length > 0 &&
            movies.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard
                  movie={item}
                  // prop thisForUrlImageMovieLastest chỉ cần thiết cho phim mới nhất nếu cấu trúc URL khác
                  thisForUrlImageMovieLastest={
                    title === "Phim Mới Cập Nhật" ? true : false
                  }
                  showNameOnHover={true}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );

  return (
    <>
      {renderMovieSection("Phim Mới Cập Nhật", moviesLastest)}
      {renderMovieSection("Phim Trung Quốc", moviesChina)}
      {renderMovieSection("Phim Hàn Quốc", moviesKorean)}
      {renderMovieSection("Phim Hoạt Hình", moviesCartoon)}
    </>
  );
};

export default Home;
