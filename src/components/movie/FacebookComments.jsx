import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FacebookComments = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // 1. Cấu hình URL cố định (Thay bằng link Vercel thực tế của bạn)
  const productionURL = "https://movie-website-three-tau.vercel.app";
  const currentURL = `${productionURL}${location.pathname}`;

  useEffect(() => {
    // Mỗi khi URL thay đổi (chuyển phim), hiện lại Loading
    setIsLoading(true);

    const parseFB = () => {
      if (window.FB) {
        try {
          // Xóa các plugin cũ để tránh bị trùng lặp
          window.FB.XFBML.parse();

          // Giả lập thời gian tải để hiệu ứng Loading mượt mà hơn
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } catch (err) {
          console.error("Facebook SDK Parse Error:", err);
          setIsLoading(false);
        }
      } else {
        // Nếu SDK chưa sẵn sàng, thử lại sau 1 giây
        setTimeout(parseFB, 1000);
      }
    };

    parseFB();
  }, [location.pathname]);

  return (
    <div
      key={currentURL} // Rất quan trọng: Buộc React render lại hoàn toàn khi đổi phim
      className="p-4 bg-gray-900 shadow-xl rounded-xl mt-8 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
          Bình luận phim
        </h3>
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
          Facebook Plugin
        </span>
      </div>

      {/* --- PHẦN LOADING SKELETON --- */}
      {isLoading && (
        <div className="space-y-4 animate-pulse p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-gray-700 rounded w-1/4"></div>
              <div className="h-2 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-20 bg-gray-700 rounded-lg w-full"></div>
          <div className="flex justify-end pt-2">
            <div className="h-8 bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      )}

      {/* --- KHUNG BÌNH LUẬN FACEBOOK --- */}
      <div
        className={`bg-white p-3 rounded-lg overflow-hidden transition-all duration-700 transform ${
          isLoading ? "opacity-0 scale-95 h-0" : "opacity-100 scale-100 h-auto"
        }`}
      >
        <div
          className="fb-comments"
          data-href={currentURL}
          data-width="100%"
          data-numposts="5"
          data-colorscheme="light"
          data-order-by="reverse_time"
        ></div>
      </div>
    </div>
  );
};

export default FacebookComments;
