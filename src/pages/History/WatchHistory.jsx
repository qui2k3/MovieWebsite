import React, { useEffect, useState } from "react";
import { getWatchHistory, auth } from "../../configs/firebaseConfig"; // Đảm bảo đúng đường dẫn tới firebaseConfig của bạn
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faSpinner,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons"; // Import icon lịch sử và mũi tên
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton"; // Import Skeleton và SkeletonTheme

const WatchHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // === START: CÁC STATE PHÂN TRANG VÀ LOGIC XỬ LÝ ===
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; // Số lượng phim hiển thị trên mỗi trang (đã điều chỉnh cho phù hợp với grid dưới đây)
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationButtons = () => {
    const pages = [];
    const maxPageButtons = 5; // Số lượng nút trang hiển thị tối đa (ví dụ: 1 2 [3] 4 5)
    // Tính toán trang bắt đầu và kết thúc để hiển thị xung quanh currentPage
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    // Nút "Trang trước"
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Trang trước
        </button>
      );
    }

    // Các nút số trang
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded-md ${
            i === currentPage
              ? "bg-red-600 text-white" // Màu cho trang hiện tại
              : "bg-gray-700 text-white hover:bg-gray-600" // Màu cho các trang khác
          }`}
        >
          {i}
        </button>
      );
    }

    // Nút "Trang sau"
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 flex items-center gap-1"
        >
          Trang sau <FontAwesomeIcon icon={faArrowRight} />
        </button>
      );
    }

    return (
      <div className="flex flex-wrap justify-center items-center gap-2 p-4 overflow-x-auto">
        {pages}
      </div>
    );
  };

  const renderPaginationSkeleton = () => {
    return (
      <div className="flex flex-wrap justify-center items-center gap-2 p-4 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton
            key={index}
            width={60} // Chiều rộng của skeleton nút
            height={38} // Chiều cao của skeleton nút
            className="mx-1 rounded-md"
            baseColor="rgb(55, 65, 81)"
            highlightColor="rgb(80, 90, 100)"
          />
        ))}
      </div>
    );
  };
  // === END: CÁC STATE PHÂN TRANG VÀ LOGIC XỬ LÝ ===

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const historyData = await getWatchHistory();
          setHistory(historyData);
          setError(null);
          setCurrentPage(1); // Reset về trang 1 khi lịch sử được tải lại
        } catch (err) {
          console.error("Lỗi khi tải lịch sử xem phim:", err);
          setError("Không thể tải lịch sử xem phim. Vui lòng thử lại.");
          setHistory([]);
        }
      } else {
        setHistory([]);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Tính toán các mục sẽ hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHistory = history.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <SkeletonTheme
          baseColor="rgb(55, 65, 81)"
          highlightColor="rgb(80, 90, 100)"
        >
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mr-3" />
          <p className="text-xl">Đang tải lịch sử xem phim...</p>
        </SkeletonTheme>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <FontAwesomeIcon
          icon={faHistory}
          className="text-6xl mb-4 text-gray-500"
        />
        <p className="text-2xl font-semibold mb-2">Bạn chưa đăng nhập</p>
        <p className="text-lg text-gray-400 text-center">
          Vui lòng đăng nhập bằng Facebook để xem và lưu lịch sử xem phim của
          bạn.
        </p>
      </div>
    );
  }

  // Nếu không có lịch sử phim sau khi tải xong
  if (history.length === 0 && !loading) {
    // Kiểm tra !loading để đảm bảo đã tải xong
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <FontAwesomeIcon
          icon={faHistory}
          className="text-6xl mb-4 text-gray-500"
        />
        <p className="text-2xl font-semibold mb-2">Không có lịch sử xem phim</p>
        <p className="text-lg text-gray-400 text-center">
          Hãy bắt đầu xem phim để lưu lại lịch sử của bạn!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010810] text-white p-6 pt-20 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-left text-blue-400">
        <FontAwesomeIcon icon={faHistory} className="mr-3" /> Lịch sử xem phim
        của bạn
      </h1>
      {/* Hiển thị các phim của trang hiện tại */}
      {/* SỬ DỤNG paginatedHistory VÀ ĐIỀU CHỈNH GRID CHO PHÙ HỢP */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-6 max-w-[1334px]">
        {paginatedHistory.map((item) => (
          <div
            key={item.id}
            onClick={() =>
              navigate(`/xem-phim/${item.slug}/${item.lastWatchedEpisodeSlug}`)
            }
            className="bg-[#010810]  rounded-lg shadow-lg overflow-hidden flex flex-col cursor-pointer items-center"
          >
            {item.poster_url || item.thumb_url ? (
              <img
                src={item.poster_url || item.thumb_url}
                alt={item.title}
                className="max-w-[145px] h-[215px] lg:max-w-[240px] lg:h-[360px] object-cover"
              />
            ) : (
              <div className="max-w-[240px] max-h-[360px] bg-gray-700 flex items-center justify-center text-gray-400 text-center px-2">
                Không có ảnh poster
              </div>
            )}

            <div className="p-4 flex-grow flex flex-col justify-between">
              <h2
                className="text-[13px] lg:text-sm font-semibold text-white mb-1 line-clamp-2"
                title={item.title}
              >
                {item.title}
              </h2>

              {item.lastWatchedEpisodeName && (
                <p className="text-gray-400 text-[12px] lg:text-xs ">
                  {/* Tập:{" "} */}
                  <span className="font-semibold text-white">
                    {item.lastWatchedEpisodeName}
                  </span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Phân trang phía dưới */}
      <div className="flex justify-center mt-8 p-4">
        {totalPages > 1 && renderPaginationButtons()}{" "}
        {/* Không cần skeleton ở đây */}
      </div>
    </div>
  );
};

export default WatchHistoryPage;
