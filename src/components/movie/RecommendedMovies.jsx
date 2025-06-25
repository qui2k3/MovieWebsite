// src/components/RecommendedMovies.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../configs/firebaseConfig"; // Import auth
import MovieCard, { MovieCardSkeleton } from "../../components/movie/MovieCard"; // Import MovieCardSkeleton
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
const RecommendedMovies = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const RECOMMENDATION_API_URL =
    "https://api-recommendationfilm.onrender.com/recommend"; // <-- Dán URL Render vào đây
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      // CHỈ gọi API nếu có người dùng đăng nhập
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        try {
          const response = await axios.post(RECOMMENDATION_API_URL, { userId });
          console.log(
            "/////////////////////////response.data.recommendations:",
            response.data.recommendations
          );
          setRecommendations(response.data.recommendations);
        } catch (err) {
          console.error("Lỗi khi gọi API gợi ý:", err);
          setError("Không thể tải phim gợi ý. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      } else {
        // Nếu không có người dùng đăng nhập, hiển thị thông báo hoặc không hiển thị gì cả
        console.log("Người dùng chưa đăng nhập. Không tải phim gợi ý.");
        setRecommendations([]); // Xóa các gợi ý cũ (nếu có)
        setLoading(false); // Đảm bảo loading được tắt
      }
    };

    fetchRecommendations();
  }, [auth.currentUser]); // useEffect chạy lại khi auth.currentUser thay đổi

  // if (loading) {
  //   return <p>Đang tải phim gợi ý...</p>;
  // }

  // if (error) {
  //   return <p>Lỗi: {error}</p>;
  // }
  const renderMovieSection = (title, movies) => (
    <section className="bg-[#010810] p-5 pt-10">
      <h2 className="text-[24px] pl-5 pb-5 text-[#FFFFFF] font-semibold ">
        {title}
      </h2>
      <Swiper
        grabCursor={true}
        spaceBetween={20}
        slidesPerView={3}
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
            movies.map((movie) => (
              <SwiperSlide key={movie.id}>
                <MovieCard
                  movie={movie}
                  // prop thisForUrlImageMovieLastest chỉ cần thiết cho phim mới nhất nếu cấu trúc URL khác
                  thisForUrlImageApiMovieLastest={
                    title === "Phim Mới Cập Nhật" ? true : false
                  }
                  thisForUrlImageApiMovieRecommend={
                    title === "Phim liên quan" ? true : false
                  }
                  showNameOnHover={false}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </section>
  );

  // CHỈ hiển thị danh sách phim nếu có gợi ý
  return <>{renderMovieSection("Phim liên quan", recommendations)}</>;
};

export default RecommendedMovies;
