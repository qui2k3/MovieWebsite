// src/components/RecommendedMovies.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../../configs/firebaseConfig"; // Import auth

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

  if (loading) {
    return <p>Đang tải phim gợi ý...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }

  // CHỈ hiển thị danh sách phim nếu có gợi ý
  return (
    <div>
      {recommendations.length > 0 ? (
        <div>
          <h3>Phim Gợi Ý</h3>
          <ul>
            {recommendations.map((movie) => (
              <li key={movie.slug}>
                {movie.name}
                {/* Thêm các thông tin khác về phim */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>
          {auth.currentUser
            ? "Không có phim gợi ý nào. Hãy xem phim để có gợi ý phù hợp!"
            : "Vui lòng đăng nhập để xem phim gợi ý."}
        </p>
      )}
    </div>
  );
};

export default RecommendedMovies;
