import React, { useEffect, useState } from "react";
import {
  getWatchHistory,
  auth,
  deleteWatchHistoryItem,
} from "../../configs/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faSpinner,
  faArrowLeft,
  faArrowRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Số lượng phim hiển thị trên mỗi trang
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn lên đầu trang khi chuyển trang
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
          className="px-4 py-2 mx-1 rounded-md bg-gray-700 text-white hover:bg-gray-600 flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Trang trước
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
            width={60}
            height={38}
            className="mx-1 rounded-md"
            baseColor="rgb(55, 65, 81)"
            highlightColor="rgb(80, 90, 100)"
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const historyData = await getWatchHistory();
          setHistory(historyData);
          setError(null);
          setCurrentPage(1);
        } catch (err) {
          console.error("Lỗi khi tải lịch sử xem phim:", err);
          setError("Không thể tải phim gợi ý. Vui lòng thử lại.");
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

  const handleDeleteItem = async (movieSlug) => {
    // Không cần dialog xác nhận khi xóa
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const success = await deleteWatchHistoryItem(movieSlug, userId);
      if (success) {
        setHistory((prevHistory) =>
          prevHistory.filter((item) => item.slug !== movieSlug)
        );
        // Điều chỉnh lại trang hiện tại nếu trang đó không còn đủ phim sau khi xóa
        if (paginatedHistory.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        alert("Không thể xóa phim khỏi lịch sử. Vui lòng thử lại.");
      }
    } else {
      alert("Vui lòng đăng nhập để thực hiện thao tác này.");
    }
  };

  // Helper function để định dạng thời gian xem (ví dụ: "12m 30s")
  const formatDuration = (totalSeconds) => {
    if (totalSeconds === 0) return "0s";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let durationParts = [];
    if (minutes > 0) durationParts.push(`${minutes}m`);
    if (seconds > 0) durationParts.push(`${seconds}s`);

    return durationParts.join(" ");
  };

  // Helper function để định dạng thông tin tập và thời lượng như trong hình
  const formatEpisodeInfo = (episodeName, totalDurationSeconds) => {
    const formattedDuration = formatDuration(totalDurationSeconds);
    // Giả định tổng thời lượng tập/phim (chúng ta không có từ API KKPhim)
    // Để hiển thị như "12m / 13m", bạn cần total_episode_duration_seconds từ API.
    // Vì không có, chúng ta chỉ hiển thị thời lượng đã xem.
    const totalEpisodeDurationPlaceholder = "XXm"; // Placeholder nếu không có dữ liệu

    if (episodeName) {
      // Nếu episodeName là số (ví dụ: "1", "2"), hiển thị "Tập X"
      if (!isNaN(episodeName) && !isNaN(parseFloat(episodeName))) {
        return `Tập ${episodeName} · ${formattedDuration}`; // Ví dụ: "Tập 1 · 12m 30s"
      }
      // Nếu episodeName là chữ (ví dụ: "Full"), hiển thị trực tiếp
      return `${episodeName} · ${formattedDuration}`; // Ví dụ: "Full · 1h 5m"
    }
    return formattedDuration; // Nếu không có tên tập, chỉ hiển thị thời lượng (ví dụ: "12m 30s")
  };

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

  if (history.length === 0) {
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
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-blue-400">
        <FontAwesomeIcon icon={faHistory} className="mr-3" /> Lịch sử xem phim
        của bạn
      </h1>

      <div className="flex justify-center mb-4 p-4">
        {loading
          ? renderPaginationSkeleton()
          : totalPages > 1 && renderPaginationButtons()}
      </div>

      {/* SỬ DỤNG paginatedHistory VÀ ĐIỀU CHỈNH GRID CHO PHÙ HỢP VỚI HÌNH ẢNH */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {paginatedHistory.map((item) => (
          <div
            key={item.id} // item.id là slug của phim
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col relative group" // relative + group for delete button hover
          >
            {/* Delete button (X icon) */}
            <button
              onClick={() => handleDeleteItem(item.slug)} // Truyền slug của phim để xóa
              className="absolute top-2 right-2 bg-red-600 rounded-full w-6 h-6 flex items-center justify-center
                           text-white text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" // Kích thước và font size nhỏ hơn
              title="Xóa khỏi lịch sử"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* Poster của phim */}
            {item.poster_url || item.thumb_url ? (
              <img
                src={item.poster_url || item.thumb_url}
                alt={item.title}
                onClick={() =>
                  navigate(
                    `/xem-phim/${item.slug}/${item.lastWatchedEpisodeSlug}`
                  )
                }
                className="w-full h-auto object-cover aspect-[2/3] cursor-pointer" // aspect-[2/3] để giữ tỉ lệ khung hình như poster phim
              />
            ) : (
              <div className="w-full h-auto aspect-[2/3] bg-gray-700 flex items-center justify-center text-gray-400 text-center text-sm px-2">
                Không có ảnh poster
              </div>
            )}

            {/* Thanh tiến độ (placeholder) */}
            {/* Bạn có thể làm động thanh này nếu có dữ liệu phần trăm xem hoặc tổng thời lượng phim */}
            {/* Ví dụ 70% tiến độ, bạn có thể thay bằng dynamic data */}
            {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
              <div className="h-full bg-blue-500 w-[70%]"></div>{" "}
            </div> */}

            {/* Phần thông tin dưới poster */}
            <div className="p-2 flex-grow flex flex-col justify-between items-center">
              {" "}
              {/* Padding nhỏ hơn */}
              {/* Thông tin Tập và Thời lượng */}
              {(item.lastWatchedEpisodeName ||
                item.total_watched_duration_seconds !== undefined) && (
                <p className="text-gray-400 text-xs mb-1">
                  {formatEpisodeInfo(
                    item.lastWatchedEpisodeName,
                    item.total_watched_duration_seconds
                  )}
                </p>
              )}
              {/* Tên phim */}
              <h2
                className="text-sm font-semibold text-white line-clamp-2 cursor-pointer hover:text-amber-400" // Font size nhỏ hơn
                title={item.title}
                onClick={() => navigate(`/phim/${item.slug}`)}
              >
                {item.title}
              </h2>
              {/* Tên gốc (nếu có, và muốn hiển thị) */}
              {item.origin_name && (
                <p
                  className="text-gray-500 text-xs mt-1 line-clamp-1"
                  title={item.origin_name}
                >
                  {item.origin_name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8 p-4">
        {totalPages > 1 && renderPaginationButtons()}
      </div>
    </div>
  );
};

export default WatchHistory;
