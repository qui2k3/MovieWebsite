import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "../../components/movie/VideoPlayer";
import FacebookComments from "../../components/movie/FacebookComments";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

import { addWatchHistory, auth } from "../../configs/firebaseConfig";

const WatchMovie = () => {
  const { movieSlug, episodeSlug } = useParams(); // episodeSlug đã có ở đây
  const navigate = useNavigate();
  const [episodeList, setEpisodeList] = useState([]);
  const [movieDetail, setMovieDetail] = useState({});
  const [movieName, setMovieName] = useState("");
  const [curentEpisodeSlug, setCurentEpisodeSlug] = useState("");
  const [indexArrServer_data, setIndexArrServer_data] = useState(0);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      console.log(
        "WatchMovie: Trạng thái người dùng đã thay đổi:",
        currentUser ? currentUser.displayName : "Chưa đăng nhập"
      );
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(
      "WatchMovie: useEffect tải phim được kích hoạt cho movieSlug:",
      movieSlug
    );

    axios
      .get(`https://phimapi.com/phim/${movieSlug}`)
      .then((response) => {
        const movie = response.data.movie || {};
        const episodes = response.data.episodes || [];

        console.log("WatchMovie: Dữ liệu phim từ API:", movie);

        setMovieDetail(movie);
        setEpisodeList(episodes);
        setMovieName(movie.name || "");

        // === START: PHẦN SỬA ĐỔI ĐỂ CHỌN TẬP PHIM ĐÚNG ===
        let initialEpisodeLink = "";
        let initialEpisodeIndex = 0;

        if (episodes.length > 0 && episodes[0]?.server_data?.length > 0) {
          const serverData = episodes[0].server_data;

          // Ưu tiên episodeSlug từ URL params nếu tồn tại
          if (episodeSlug) {
            const foundIndex = serverData.findIndex(
              (ep) => ep.slug === episodeSlug
            );
            if (foundIndex !== -1) {
              initialEpisodeLink = serverData[foundIndex].link_embed;
              initialEpisodeIndex = foundIndex;
              console.log("WatchMovie: Phát tập từ URL params:", episodeSlug);
            } else {
              // Nếu không tìm thấy tập theo slug, mặc định phát tập đầu tiên
              initialEpisodeLink = serverData[0].link_embed;
              initialEpisodeIndex = 0;
              console.warn(
                "WatchMovie: Không tìm thấy tập theo slug từ URL params. Phát tập đầu tiên."
              );
            }
          } else {
            // Nếu không có episodeSlug trong URL params, phát tập đầu tiên
            initialEpisodeLink = serverData[0].link_embed;
            initialEpisodeIndex = 0;
            console.log(
              "WatchMovie: Phát tập đầu tiên (không có episodeSlug từ URL)."
            );
          }
        }

        setCurentEpisodeSlug(initialEpisodeLink);
        setIndexArrServer_data(initialEpisodeIndex);
        // === END: PHẦN SỬA ĐỔI ===

        setLoading(false);

        // === GỌI addWatchHistory TẠI ĐÂY KHI PHIM ĐƯỢC TẢI THÀNH CÔNG ===
        console.log(
          "WatchMovie: Kiểm tra điều kiện lưu lịch sử. User:",
          !!user,
          "Movie ID:",
          !!movie._id,
          "Movie Name:",
          movie.name
        );

        if (user && movie && movie._id) {
          const genres = movie.category
            ? movie.category.map((cat) => cat.name)
            : [];
          // Lấy thông tin về tập phim đang được xem ban đầu (đã được xác định ở trên)
          const currentEpisode =
            episodes[0]?.server_data?.[initialEpisodeIndex];

          console.log(
            "WatchMovie: Điều kiện lưu lịch sử được đáp ứng. Đang gọi addWatchHistory cho:",
            movie.name
          );

          addWatchHistory(
            {
              id: movie._id,
              title: movie.name,
              genres: genres,
              slug: movie.slug,
              poster_url: movie.poster_url,
              thumb_url: movie.thumb_url,
              year: movie.year,
            },
            {
              slug: currentEpisode?.slug || null,
              name: currentEpisode?.name || null,
            }
          );
        } else if (!user) {
          console.warn(
            "WatchMovie: Người dùng chưa đăng nhập. Không lưu lịch sử xem phim."
          );
        } else if (!movie || !movie._id) {
          console.warn(
            "WatchMovie: Dữ liệu phim không hợp lệ (thiếu movie object hoặc _id). Không lưu lịch sử xem phim."
          );
        }
      })
      .catch((error) => {
        console.error("WatchMovie: Lỗi khi tải chi tiết phim:", error);
        setLoading(false);
      });
  }, [movieSlug, user, episodeSlug]); // QUAN TRỌNG: Thêm episodeSlug vào dependency array

  const handleEpisodeClick = (slug, index) => {
    setIndexArrServer_data(index);
    navigate(`/xem-phim/${movieSlug}/${slug}`);

    // === GỌI addWatchHistory KHI CHUYỂN TẬP ===
    // Đảm bảo movieDetail đã có dữ liệu trước khi gọi
    if (user && movieDetail && movieDetail._id) {
      const genres = movieDetail.category
        ? movieDetail.category.map((cat) => cat.name)
        : [];
      const currentEpisode = episodeList[0]?.server_data?.[index];

      console.log(
        "WatchMovie: Đang lưu lịch sử khi chuyển tập cho:",
        movieDetail.name,
        "Tập:",
        currentEpisode?.name
      );

      addWatchHistory(
        {
          id: movieDetail._id,
          title: movieDetail.name,
          genres: genres,
          slug: movieDetail.slug,
          poster_url: movieDetail.poster_url,
          thumb_url: movieDetail.thumb_url,
          year: movieDetail.year,
        },
        {
          slug: currentEpisode?.slug || null,
          name: currentEpisode?.name || null,
        }
      );
    }
  };

  return (
    <SkeletonTheme
      baseColor="rgb(55, 65, 81)"
      highlightColor="rgb(80, 90, 100)"
    >
      <div className="bg-[#010810] text-white">
        <div className="text-[22px] font-semibold p-2 ml-10 flex items-center">
          <FontAwesomeIcon
            icon={faCircleLeft}
            onClick={() => navigate(`/phim/${movieSlug}`)}
            className="mr-1 p-3 cursor-pointer"
          />
          <h2 className="text-base lg:text-2xl">
            {loading ? (
              <Skeleton width="500px" height="27px" />
            ) : (
              `Xem phim ${movieName}`
            )}
          </h2>
        </div>

        {/* Hiển thị video hoặc Skeleton */}
        {loading ? (
          <Skeleton width="100%" height="500px" />
        ) : (
          <VideoPlayer link={curentEpisodeSlug} />
        )}

        {/* Danh sách tập */}
        <div className="mx-auto p-3">
          {loading ? (
            <ul className="flex gap-2 flex-wrap items-center">
              {Array(18)
                .fill()
                .map((_, i) => (
                  <Skeleton
                    key={i}
                    width="62px"
                    height="45px"
                    className="rounded-sm p-1"
                  />
                ))}
            </ul>
          ) : (
            <ul className="flex gap-2 flex-wrap items-center">
              {episodeList?.[0]?.server_data?.map((obj, index) => (
                <li
                  key={index}
                  onClick={() => handleEpisodeClick(obj.slug, index)}
                  className={`block bg-[#4f4f4f] w-[62px] h-[45px] text-[14px] font-semibold text-center p-1 text-[#fffef8] rounded-sm cursor-pointer ${
                    indexArrServer_data === index ? "bg-green-500" : ""
                  }`}
                >
                  {obj.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <FacebookComments />
      </div>
    </SkeletonTheme>
  );
};

export default WatchMovie;
