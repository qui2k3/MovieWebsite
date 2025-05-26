import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import VideoPlayer from "../../components/movie/VideoPlayer";
const MovieDetails = () => {
  const { movieSlug } = useParams();
  const navigate = useNavigate();
  const [movieDetail, setMovieDetail] = useState({});
  const [episodeSlug, setEpisodeSlug] = useState("");
  const [episodeList, setEpisodeList] = useState([]);

  const getMovies = () => {
    return axios
      .get(`https://phimapi.com/phim/${movieSlug}`)
      .then((response) => {
        const movie = response.data.movie;
        const episodes = response.data.episodes;
        return { movie, episodes };
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getMovies().then(({ movie, episodes }) => {
      if (movie) {
        setMovieDetail(movie || {});
      }
      if (episodes) {
        setEpisodeList(episodes || []);
        const firstEpisodeSlug = episodes?.[0]?.server_data?.[0]?.slug || "";
        setEpisodeSlug(firstEpisodeSlug);
      }
    });
  }, [movieSlug]);
  const handleNavigate = () => {
    // chua co episodeSlug
    if (episodeSlug) {
      console.log(episodeSlug);
      navigate(`/DangXemTap/${movieSlug}/${episodeSlug}`, {
        state: {
          episodeList: episodeList,
          movieDetail: movieDetail,
        }
      });
    } else {
      console.error("Không tìm thấy tập  phim đầu tiên để chuyển hướng");
    }
    console.log("clicked");
  };
  return (
    <div className="text-red-400 bg-[#010810]   max-w-full pt-8">
      <div className="flex flex-col">
        {movieDetail ? (
          <>
            <div
              key={movieDetail.id}
              className="max-w-2xl w-full  p-[10px] flex mx-auto item-stretch justify-center bg-[#181818] gap-x-[10px] "
            >
              <div
                className="relative cursor-pointer max-w-[240px] w-full max-h-[340px] "
                onClick={handleNavigate}
              >
                <img
                  src={movieDetail.poster_url}
                  className="w-full aspect-[2/3] h-full object-cover"
                ></img>
                <div className="absolute bottom-0 -translate-y-full w-full h-[50px] flex flex-col justify-center items-center text-center text-white  leading-4 bg-[#da2511] bg-opacity-60  ">
                  <span className="block text-center font-semibold w-full">
                    Xem Phim
                  </span>
                </div>
              </div>
              <div className=" overflow-hidden max-h-[340px] ">
                <div className="bg-[#222222] text-[#acb5a2] pl-3 h-full overflow-y-scroll ">
                  <h2 className="text-[#f7975a] text-[25px]  font-bold ">
                    {movieDetail.name}
                  </h2>
                  <div>
                    <strong>Trạng thái:</strong> {movieDetail.episode_current}
                  </div>
                  <div>
                    <strong>Đạo diễn:</strong> {movieDetail.director}
                  </div>
                  <div>
                    <strong>Thời lượng: </strong>
                    {movieDetail.time}
                  </div>
                  <div>
                    <strong>Số tập:</strong> {movieDetail.episode_total}
                  </div>
                  <div>
                    <strong>Tình trạng: </strong>
                    {movieDetail.episode_current}
                  </div>
                  <div>
                    <strong>Ngôn ngữ: </strong> {movieDetail.lang}
                  </div>
                  <div>
                    <strong>Năm sản xuất: </strong>
                    {movieDetail.year}
                  </div>
                  <div>
                    <strong>Quốc gia:</strong>{" "}
                    {movieDetail.country?.[0]?.name || "Đang cập nhật"}
                  </div>
                  <div>
                    <strong>Thể loại:</strong>{" "}
                    {movieDetail.category
                      ?.map((item) => item.name)
                      .join(", ") || "Đang cập nhật"}
                  </div>
                  <div className="flex flex-wrap items-center   ">
                    <strong className="mr-2">Diễn viên:</strong>{" "}
                    {movieDetail.actor?.join(", ") ||
                      "Không có thông tin diễn viên"}
                  </div>
                </div>
              </div>
            </div>
            <div className=" bg-[#222222] max-w-2xl w-full mx-auto p-2">
              <h2 className="underline text-[#c58560] text-lg font-bold">
                Nội dung phim: {movieDetail.name}
              </h2>
              <p className="text-sm leading-6 text-[#828282]">
                {movieDetail.content
                  ? `${movieDetail.content}`
                  : "Không có mô tả"}
              </p>
            </div>
          </>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
