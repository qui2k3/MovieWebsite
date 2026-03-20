import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FacebookComments = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // Tự động lấy URL hiện tại, khớp 100% với trình duyệt
  const currentURL = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    setIsLoading(true);

    const parseFB = () => {
      // Kiểm tra cả SDK và thẻ div đã render chưa
      const fbDiv = document.getElementsByClassName("fb-comments")[0];

      if (window.FB && fbDiv) {
        try {
          // Gán lại href mới cho thẻ div trước khi parse
          fbDiv.setAttribute("data-href", currentURL);

          window.FB.XFBML.parse();

          // Đợi Facebook render xong iframe rồi mới tắt loading
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        } catch (err) {
          console.error("FB Parse Error:", err);
          setIsLoading(false);
        }
      } else {
        // Thử lại sau mỗi 500ms thay vì 1s để nhanh hơn
        setTimeout(parseFB, 500);
      }
    };

    parseFB();
  }, [location.pathname, currentURL]);

  return (
    <div
      key={location.pathname} // Dùng pathname làm key để reset component
      className="p-4 bg-gray-900 shadow-xl rounded-xl mt-8 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
          Bình luận phim
        </h3>
        <span className="text-xs uppercase tracking-widest font-semibold text-gray-500">
          Facebook Plugin
        </span>
      </div>

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
        </div>
      )}

      <div
        className={`bg-white p-3 rounded-lg transition-all duration-700 ${
          isLoading ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
        }`}
      >
        <div
          className="fb-comments"
          data-href={currentURL}
          data-width="100%"
          data-numposts="5"
          data-colorscheme="light"
        ></div>
      </div>
    </div>
  );
};

export default FacebookComments;
