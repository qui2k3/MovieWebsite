import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "../../components/movie/VideoPlayer";
import FacebookComments from "../../components/movie/FacebookComments";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

import { addWatchHistory, auth } from "../../configs/firebaseConfig";
import RecommendedMovies from "../../components/movie/RecommendedMovies";

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

  const sessionStartTimeRef = useRef(null); // Ref để lưu thời gian bắt đầu phiên xem
  const lastSavedMovieDataRef = useRef(null); // Ref để lưu dữ liệu phim cuối cùng được lưu (cho cleanup)
  const lastSavedEpisodeInfoRef = useRef(null); // Ref để lưu thông tin tập cuối cùng được lưu (cho cleanup)

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
    // Chỉ fetch movie data nếu movieSlug có giá trị
    if (!movieSlug) {
      console.log("WatchMovie: movieSlug không có, bỏ qua useEffect tải phim.");
      return;
    }

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

        // Xác định tập phim ban đầu để phát
        let initialEpisodeLink = "";
        let initialEpisodeIndex = 0;
        if (episodes.length > 0 && episodes[0]?.server_data?.length > 0) {
          const serverData = episodes[0].server_data;
          if (episodeSlug) {
            const foundIndex = serverData.findIndex(
              (ep) => ep.slug === episodeSlug
            );
            if (foundIndex !== -1) {
              initialEpisodeLink = serverData[foundIndex].link_embed;
              initialEpisodeIndex = foundIndex;
              console.log("WatchMovie: Phát tập từ URL params:", episodeSlug);
            } else {
              initialEpisodeLink = serverData[0].link_embed;
              initialEpisodeIndex = 0;
              console.warn(
                "WatchMovie: Không tìm thấy tập theo slug từ URL params. Phát tập đầu tiên."
              );
            }
          } else {
            initialEpisodeLink = serverData[0].link_embed;
            initialEpisodeIndex = 0;
            console.log(
              "WatchMovie: Phát tập đầu tiên (không có episodeSlug từ URL)."
            );
          }
        }
        setCurentEpisodeSlug(initialEpisodeLink);
        setIndexArrServer_data(initialEpisodeIndex);

        setLoading(false);

        // --- MỚI: Ghi nhận thời gian bắt đầu phiên và lưu thông tin phim cho cleanup ---
        sessionStartTimeRef.current = Date.now(); // Ghi nhận thời gian bắt đầu phiên ngay sau khi phim tải xong
        console.log(
          "DEBUG: WatchMovie - START SESSION TIME SET:",
          new Date(sessionStartTimeRef.current).toLocaleString()
        );

        // Lưu thông tin phim và tập hiện tại vào ref để cleanup function có thể truy cập
        // (Vì movieDetail, episodeList, indexArrServer_data có thể thay đổi sau đó)
        lastSavedMovieDataRef.current = {
          id: movie._id,
          title: movie.name,
          genres: movie.category ? movie.category.map((cat) => cat.name) : [],
          slug: movie.slug,
          poster_url: movie.poster_url,
          thumb_url: movie.thumb_url,
          year: movie.year,
        };
        lastSavedEpisodeInfoRef.current = {
          slug: episodes[0]?.server_data?.[initialEpisodeIndex]?.slug || null,
          name: episodes[0]?.server_data?.[initialEpisodeIndex]?.name || null,
        };

        console.log(
          "DEBUG: WatchMovie - Dữ liệu phim được gán cho cleanup:",
          lastSavedMovieDataRef.current?.name,
          "Tập:",
          lastSavedEpisodeInfoRef.current?.name
        );
      })
      .catch((error) => {
        console.error("WatchMovie: Lỗi khi tải chi tiết phim:", error);
        setLoading(false);
      });

    // --- Cleanup function (chạy khi component unmount hoặc user thoát trang/tab) ---
    const handleSaveSessionDuration = async () => {
      const sessionEndTime = Date.now();
      const startTime = sessionStartTimeRef.current || 0; // Đảm bảo startTime không phải null
      const durationSeconds = Math.floor((sessionEndTime - startTime) / 1000);

      const currentMovie = lastSavedMovieDataRef.current;
      const currentEpisodeInfo = lastSavedEpisodeInfoRef.current;
      const currentUser = auth.currentUser;

      console.log(
        `DEBUG: WatchMovie - [CLEANUP] Tính duration: ${durationSeconds}s. Bắt đầu: ${new Date(
          startTime
        ).toLocaleString()}. Kết thúc: ${new Date(
          sessionEndTime
        ).toLocaleString()}. User: ${!!currentUser}. Movie: ${!!currentMovie?.slug}.`
      );

      // CHỈ LƯU LỊCH SỬ NẾU THỜI GIAN XEM > 0 GIÂY, CÓ NGƯỜI DÙNG VÀ DỮ LIỆU PHIM HỢP LỆ
      if (
        durationSeconds > 0 &&
        currentMovie &&
        currentMovie.slug &&
        currentUser
      ) {
        console.log(
          `DEBUG: WatchMovie - [CLEANUP] Đang gọi addWatchHistory cho ${currentMovie.name} với ${durationSeconds}s.`
        );
        await addWatchHistory(
          currentMovie,
          currentEpisodeInfo,
          durationSeconds
        );
      } else if (durationSeconds === 0 && currentMovie) {
        console.warn(
          `WatchMovie: [CLEANUP] Thời gian xem 0s cho phim ${currentMovie.name}. Không lưu.`
        );
      } else if (!currentUser) {
        console.warn(
          "WatchMovie: [CLEANUP] Không lưu thời gian xem vì người dùng chưa đăng nhập khi thoát."
        );
      } else {
        console.warn(
          "WatchMovie: [CLEANUP] Không lưu thời gian xem vì dữ liệu phim chưa hợp lệ khi thoát."
        );
      }
    };

    window.addEventListener("beforeunload", handleSaveSessionDuration);

    return () => {
      window.removeEventListener("beforeunload", handleSaveSessionDuration);
      handleSaveSessionDuration(); // Gọi logic lưu khi component unmount
    };
  }, [movieSlug, user, episodeSlug]); // Depend on user, movieSlug, episodeSlug để re-run effect và thiết lập listeners

  const handleEpisodeClick = (slug, index) => {
    // LƯU THỜI LƯỢNG CỦA PHIÊN HIỆN TẠI TRƯỚC KHI CHUYỂN TẬP
    const sessionEndTime = Date.now();
    const startTime = sessionStartTimeRef.current || 0; // Đảm bảo startTime không phải null
    const durationSeconds = Math.floor((sessionEndTime - startTime) / 1000);

    console.log(
      `DEBUG: WatchMovie - [EPISODE_CLICK] Tính duration: ${durationSeconds}s. Bắt đầu: ${new Date(
        startTime
      ).toLocaleString()}. Kết thúc: ${new Date(
        sessionEndTime
      ).toLocaleString()}.`
    ); // <<< THÊM LOG

    if (durationSeconds > 0 && user && movieDetail && movieDetail.slug) {
      const genres = movieDetail.category
        ? movieDetail.category.map((cat) => cat.name)
        : [];
      const currentEpisodePlayed =
        episodeList[0]?.server_data?.[indexArrServer_data]; // Tập vừa xem xong

      console.log(
        `DEBUG: WatchMovie - [EPISODE_CLICK] Đang gọi addWatchHistory cho ${movieDetail.name} (tập vừa xem) với ${durationSeconds}s.`
      ); // <<< THÊM LOG TRƯỚC GỌI HÀM
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
          slug: currentEpisodePlayed?.slug || null,
          name: currentEpisodePlayed?.name || null,
        },
        durationSeconds
      );
    } else if (durationSeconds === 0 && movieDetail) {
      console.warn(
        `WatchMovie: [EPISODE_CLICK] Thời gian xem 0s cho phim ${movieDetail.name}. Không lưu.`
      );
    } else {
      console.warn(
        `WatchMovie: [EPISODE_CLICK] Không lưu thời gian xem vì dữ liệu phim chưa hợp lệ.`
      );
    }

    // RESET THỜI GIAN BẮT ĐẦU PHIÊN CHO TẬP MỚI
    sessionStartTimeRef.current = Date.now();
    console.log(
      "DEBUG: WatchMovie - [EPISODE_CLICK] Reset thời gian bắt đầu phiên mới lúc:",
      new Date(sessionStartTimeRef.current).toLocaleString()
    ); // <<< THÊM LOG

    setIndexArrServer_data(index);
    navigate(`/xem-phim/${movieSlug}/${slug}`);

    // LƯU Ý: Không cần gọi addWatchHistory với 0s cho tập mới ở đây nữa.
    // Vì cleanup function của useEffect sẽ gọi khi component unmounts/navigates AWAY.
    // Nếu người dùng ở lại xem tập mới, thời gian đó sẽ được tính trong phiên tiếp theo.
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
        <RecommendedMovies />
      </div>
    </SkeletonTheme>
  );
};

export default WatchMovie;
