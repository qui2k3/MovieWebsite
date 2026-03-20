import React, { useEffect, useState } from "react";

const FacebookComments = ({ movieSlug }) => {
  const [isLoading, setIsLoading] = useState(true);

  // ÉP TẤT CẢ BÌNH LUẬN VỀ LINK TRANG CHI TIẾT PHIM
  // Việc này giúp Tập 1, Tập 2... đều hiện chung 1 danh sách bình luận
  const currentURL = `${window.location.origin}/phim/${movieSlug}`;

  useEffect(() => {
    // 1. Mỗi khi đổi phim hoặc đổi tập (nếu slug đổi), hiện lại Loading
    setIsLoading(true);

    const parseFB = () => {
      const fbDiv = document.querySelector(".fb-comments");

      if (window.FB && fbDiv) {
        try {
          // 2. Cập nhật URL chính xác cho thẻ div trước khi Facebook quét
          fbDiv.setAttribute("data-href", currentURL);

          // 3. Gọi lệnh quét của Facebook SDK
          window.FB.XFBML.parse();

          // 4. CHỐNG LỖI HIỆN HOÀI:
          // Đợi 2 giây để Facebook vẽ xong Iframe rồi mới tắt màn hình chờ
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
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
      key={movieSlug} // Reset component khi đổi phim để tránh dính comment cũ
      className="p-4 bg-gray-900 shadow-xl rounded-xl mt-8 border border-gray-800 w-full overflow-hidden"
    >
      {/* Tiêu đề khung bình luận */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-700 pb-3">
        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
          Bình luận phim
        </h3>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          Facebook Plugin
        </span>
      </div>

      {/* BOX CHỨA PLUGIN: Dùng nền trắng để SDK render ổn định */}
      <div className="relative bg-white rounded-lg p-3 min-h-[250px] flex flex-col justify-center">
        {/* LỚP 1: SKELETON LOADING (Hiện đè lên trên khi đang tải) */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-white p-4 space-y-4 animate-pulse rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-100 rounded-lg w-full"></div>
            <div className="flex justify-end pt-2">
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        )}

        {/* LỚP 2: KHUNG BÌNH LUẬN THẬT 
            KHÔNG dùng h-0 để tránh lỗi SDK không render được chiều cao.
            Dùng opacity-0 để nó load ngầm bên dưới lớp Skeleton. */}
        <div
          className={`fb-comments transition-opacity duration-700 w-full ${
            isLoading
              ? "opacity-0 invisible absolute"
              : "opacity-100 visible relative"
          }`}
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
