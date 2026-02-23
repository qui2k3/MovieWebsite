import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../configs/firebaseConfig"; // Import auth
import MovieCard, { MovieCardSkeleton } from "../../components/movie/MovieCard"; // Import MovieCardSkeleton
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";
import { useLocation } from "react-router-dom"; // Import useLocation để theo dõi thay đổi route

const RecommendedMovies = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true); // Giữ true ban đầu để cho phép useEffect chạy
  const [error, setError] = useState(null);
  const RECOMMENDATION_API_URL =
    "https://api-recommendationfilm.onrender.com/recommend"; // <-- Dán URL Render vào đây

  const location = useLocation(); // Khởi tạo hook useLocation

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true); // Luôn bật loading khi bắt đầu fetch
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
          setRecommendations([]); // Xóa các gợi ý nếu có lỗi
        } finally {
          setLoading(false); // Đảm bảo loading được tắt sau khi hoàn tất (thành công hoặc thất bại)
        }
      } else {
        // Nếu không có người dùng đăng nhập
        console.log("Người dùng chưa đăng nhập. Không tải phim gợi ý.");
        setRecommendations([]); // Xóa các gợi ý cũ (nếu có)
        setLoading(false); // Đảm bảo loading được tắt
      }
    };

    // Lắng nghe trạng thái xác thực của Firebase VÀ thay đổi của location.key
    // Điều này đảm bảo API được gọi lại khi:
    // 1. Component mount lần đầu
    // 2. Trạng thái đăng nhập thay đổi (đăng nhập/đăng xuất)
    // 3. Có sự điều hướng nội bộ trong React Router (ngay cả khi pathname không đổi, key vẫn đổi)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Gọi fetchRecommendations ngay khi trạng thái người dùng được xác định
      fetchRecommendations();
    });

    // Cleanup function: hủy đăng ký listener khi component unmount
    return () => unsubscribe; // onAuthStateChanged trả về hàm unsubscribe

    // Dependency array chứa auth.currentUser (để phản ứng với đăng nhập/đăng xuất)
    // và location.key (để phản ứng với điều hướng nội bộ)
  }, [auth.currentUser, location.key]); // THAY ĐỔI LỚN NHẤT TẠI ĐÂY

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
                  // Các prop này có thể được đơn giản hóa nếu MovieCard xử lý URL chung
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
      {/* Error display moved to main return logic for better control */}
    </section>
  );

  // Logic hiển thị chính dựa trên trạng thái loading, error, user và recommendations

  // 1. Nếu người dùng chưa đăng nhập VÀ không còn loading
  if (!auth.currentUser && !loading) {
    return (
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-[#FFFFFF] font-semibold">
          Phim liên quan
        </h2>
        <p className="text-white text-center text-lg">
          Vui lòng <span className="font-bold text-[#0079FF]">đăng nhập</span>{" "}
          và <span className="font-bold text-[#0079FF]">xem phim</span> để được
          gợi ý phim.
        </p>
      </section>
    );
  }

  // 2. Nếu đang tải (áp dụng cho cả trường hợp đã đăng nhập và chưa đăng nhập, nhưng component đang fetch)
  if (loading) {
    return renderMovieSection("Phim liên quan", []); // Hiển thị skeleton
  }

  // 3. Nếu có lỗi sau khi tải xong (cho người dùng đã đăng nhập)
  if (error) {
    return (
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-[#FFFFFF] font-semibold">
          Phim liên quan
        </h2>
        <p className="text-red-500 text-center text-[18px]">Lỗi: {error}</p>
      </section>
    );
  }

  // 4. Nếu đã đăng nhập nhưng không có gợi ý nào (list recommendations rỗng)
  if (auth.currentUser && recommendations.length === 0) {
    return (
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-[#FFFFFF] font-semibold">
          Phim liên quan
        </h2>
        <p className="text-[#FFFFFF] text-center text-[18px] px-4">
          Hiện tại chưa có phim gợi ý nào. Vui lòng xem thêm phim để hệ thống có
          thể đề xuất cho bạn!
        </p>
      </section>
    );
  }

  // 5. Mặc định: Hiển thị danh sách phim gợi ý (khi có dữ liệu và không có lỗi/loading)
  return <>{renderMovieSection("Phim liên quan", recommendations)}</>;
};

export default RecommendedMovies;
