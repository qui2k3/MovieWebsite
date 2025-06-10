import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../../components/movie/VideoPlayer";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MovieDetails = () => {
  const { movieSlug } = useParams();
  const navigate = useNavigate();
  const [movieDetail, setMovieDetail] = useState({});
  const [episodeSlug, setEpisodeSlug] = useState("");
  const [episodeList, setEpisodeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://phimapi.com/phim/${movieSlug}`)
      .then((response) => {
        setMovieDetail(response.data.movie || {});
        setEpisodeList(response.data.episodes || []);
        setEpisodeSlug(
          response.data.episodes?.[0]?.server_data?.[0]?.slug || ""
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieSlug]);

  const handleNavigate = () => {
    if (episodeSlug) {
      navigate(`/xem-phim/${movieSlug}/${episodeSlug}`, {
        state: { episodeList, movieDetail },
      });
    } else {
      console.error("Không tìm thấy tập phim đầu tiên để chuyển hướng");
    }
  };

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="text-red-400 bg-[#010810] max-w-full pt-8">
        <div className="flex flex-col">
          {loading ? (
            <>
              <div className="max-w-2xl w-full p-[10px] flex mx-auto bg-[#181818] gap-x-[10px]">
                {/* top left */}
                <div className="relative cursor-pointer max-w-[240px] w-full max-h-[340px]">
                  <Skeleton
                    height="100%"
                    width="100%"
                    className="w-full aspect-[2/3] h-full rounded-lg"
                  />
                </div>
                {/* top right */}
                <div className="overflow-hidden max-h-[340px]">
                  <div className="bg-[#222222] text-[#acb5a2] pl-3 h-full min-h-[340px] w-full">
                    <Skeleton height={32} width="60%" />
                    <Skeleton count={8} height="100%" width={432} />
                  </div>
                </div>
              </div>
              {/* bottom */}
              <div className="bg-[#222222] max-w-2xl w-full mx-auto p-2">
                <Skeleton height={30} width="60%" />
                <Skeleton count={8} height={18} width="100%" />
              </div>
            </>
          ) : (
            <>
              <div className="max-w-2xl w-full p-[10px] flex mx-auto bg-[#181818] gap-x-[10px]">
                <div
                  className="relative cursor-pointer  min-w-[240px] max-w-[241px] w-full max-h-[340px]"
                  onClick={handleNavigate}
                >
                  <img
                    src={movieDetail.poster_url}
                    className="w-full aspect-[2/3] h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 -translate-y-full w-full h-[50px] flex flex-col justify-center items-center text-center text-white leading-4 bg-[#da2511] bg-opacity-60">
                    <span className="block text-center font-semibold w-full">
                      Xem Phim
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden max-h-[340px] min-h-[340px]">
                  <div className="bg-[#222222] text-[#acb5a2] pl-3 h-full overflow-y-scroll">
                    <h2 className="text-[#f7975a] text-[25px] font-bold">
                      {movieDetail.name}
                    </h2>
                    <p>
                      <strong>Trạng thái:</strong> {movieDetail.episode_current}
                    </p>
                    <p>
                      <strong>Đạo diễn:</strong> {movieDetail.director}
                    </p>
                    <p>
                      <strong>Thời lượng:</strong> {movieDetail.time}
                    </p>
                    <p>
                      <strong>Số tập:</strong> {movieDetail.episode_total}
                    </p>
                    <p>
                      <strong>Ngôn ngữ:</strong> {movieDetail.lang}
                    </p>
                    <p>
                      <strong>Năm sản xuất:</strong> {movieDetail.year}
                    </p>
                    <p>
                      <strong>Quốc gia:</strong>{" "}
                      {movieDetail.country?.[0]?.name || "Đang cập nhật"}
                    </p>
                    <p>
                      <strong>Thể loại:</strong>{" "}
                      {movieDetail.category
                        ?.map((item) => item.name)
                        .join(", ") || "Đang cập nhật"}
                    </p>
                    <p>
                      <strong>Diễn viên:</strong>{" "}
                      {movieDetail.actor?.join(", ") ||
                        "Không có thông tin diễn viên"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#222222] max-w-2xl w-full mx-auto p-2">
                <h2 className="underline text-[#c58560] text-lg font-bold">
                  Nội dung phim: {movieDetail.name}
                </h2>
                <p className="text-sm leading-6 text-[#828282]">
                  {movieDetail.content || "Không có mô tả"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default MovieDetails;
