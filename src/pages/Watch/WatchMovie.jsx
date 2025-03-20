import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "../../components/movie/VideoPlayer";

const WatchMovie = () => {
  const { movieSlug, episodeSlug } = useParams(); // :movieSlug/:episodeSlug
  const navigate = useNavigate();

  const [episodeList, setEpisodeList] = useState([]);
  const [movieDetail, setMovieDetail] = useState({});
  const [curentEpisodeSlug, setCurentEpisodeSlug] = useState("");
  const [indexArrServer_data, setIndexArrServer_data] = useState(0);

  // Gọi API để lấy dữ liệu phim
  useEffect(() => {
    axios.get(`https://phimapi.com/phim/${movieSlug}`).then((response) => {
      const movie = response.data.movie || {};
      const episodes = response.data.episodes || [];
      setMovieDetail(movie);
      setEpisodeList(episodes);

      // Đặt tập mặc định
      if (episodes.length > 0 && episodes[0]?.server_data?.length > 0) {
        setCurentEpisodeSlug(episodes[0].server_data[0]?.link_embed || ""); // Tập đầu tiên
        setIndexArrServer_data(0); // Chỉ mục mặc định là 0
      }
    });
  }, [movieSlug]);

  // Cập nhật link khi chỉ mục thay đổi
  useEffect(() => {
    if (episodeList.length > 0 && episodeList[0]?.server_data?.length > 0) {
      setCurentEpisodeSlug(
        episodeList[0].server_data[indexArrServer_data]?.link_embed || ""
      );
    }
  }, [episodeList, indexArrServer_data]);

  // Xử lý click vào tập
  const handleEpisodeClick = (slug, index) => {
    setIndexArrServer_data(index); // Cập nhật chỉ mục tập
    navigate(`/DangXemTap/${movieSlug}/${slug}`); // Điều hướng đến tập mới
  };

  return (
    <div className="bg-[#010810] text-white">
      {/* Hiển thị video */}
      <VideoPlayer link={curentEpisodeSlug} />

      {/* Thông tin phim */}
      {/* <h1>{movieSlug}</h1>
      <p>episodeSlug: {episodeSlug}</p>
      <p>movieSlug: {movieSlug}</p>
      <h1 className="text-white z-50">
        {episodeList?.[0]?.server_name ? episodeList[0].server_name : "null"}
      </h1> */}

      {/* Danh sách tập */}

      <div className="mx-auto p-3">
        <ul className="flex gap-2 flex-wrap items-center">
          {episodeList?.[0]?.server_data
            ? episodeList[0].server_data.map((obj, index) => (
                <li
                  key={index}
                  onClick={() => handleEpisodeClick(obj.slug, index)} // Truyền slug và chỉ mục
                  className={`block bg-[#4f4f4f] w-[62px] h-[45px] text-[14px] font-semibold text-center p-1 text-[#fffef8] rounded-sm cursor-pointer ${
                    indexArrServer_data === index ? "bg-green-500" : ""
                  }`}
                >
                  {obj.name}
                </li>
              ))
            : "null"}
        </ul>
      </div>
    </div>
  );
};

export default WatchMovie;
