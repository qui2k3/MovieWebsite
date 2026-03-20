import React, { useEffect, useState } from "react";

// Nhận movieSlug từ props truyền vào (ví dụ: "phuong-hoa-ly")
const FacebookComments = ({ movieSlug }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Lấy domain hiện tại (Vercel) + đường dẫn trang chi tiết phim
  // Ví dụ: https://movie-website-three-tau.vercel.app/phim/phuong-hoa-ly
  const currentURL = `${window.location.origin}/phim/${movieSlug}`;

  useEffect(() => {
    // 1. Mỗi khi đổi phim, hiện lại màn hình loading
    setIsLoading(true);

    const parseFB = () => {
      const fbDiv = document.getElementsByClassName("fb-comments")[0];

      if (window.FB && fbDiv) {
        try {
          // 2. Ép thẻ div nhận URL của trang chi tiết phim
          fbDiv.setAttribute("data-href", currentURL);

          // 3. Gọi lệnh quét của Facebook SDK
          window.FB.XFBML.parse();

          // 4. Chờ 1 khoảng ngắn để UI hiển thị rồi tắt Loading
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        } catch (err) {
          console.error("Facebook SDK Parse Error:", err);
          setIsLoading(false);
        }
      } else {
        // Nếu SDK chưa tải xong, thử lại sau 500ms
        setTimeout(parseFB, 500);
      }
    };

    parseFB();
  }, [movieSlug, currentURL]);

  return (
    <div
      key={movieSlug} // Quan trọng: Reset component khi đổi phim
      className="p-4 bg-gray-900 shadow-xl rounded-xl mt-8 border border-gray-800 w-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
          Bình luận phim
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          Facebook Plugin
        </span>
      </div>

      {/* HIỆU ỨNG SKELETON LOADING */}
      {isLoading && (
        <div className="space-y-4 animate-pulse p-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-gray-700 rounded w-1/4"></div>
              <div className="h-2 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-24 bg-gray-700 rounded-lg w-full"></div>
        </div>
      )}

      {/* KHUNG BÌNH LUẬN THẬT (Ẩn khi đang load) */}
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
