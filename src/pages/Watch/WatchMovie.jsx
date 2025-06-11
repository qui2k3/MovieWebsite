import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "../../components/movie/VideoPlayer";
import FacebookComments from "../../components/movie/FacebookComments";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WatchMovie = () => {
  const { movieSlug, episodeSlug } = useParams();
  const navigate = useNavigate();
  const [episodeList, setEpisodeList] = useState([]);
  const [movieDetail, setMovieDetail] = useState({});
  const [movieName, setMovieName] = useState("");
  const [curentEpisodeSlug, setCurentEpisodeSlug] = useState("");
  const [indexArrServer_data, setIndexArrServer_data] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://phimapi.com/phim/${movieSlug}`)
      .then((response) => {
        const movie = response.data.movie || {};
        const episodes = response.data.episodes || [];
        setMovieDetail(movie);
        setEpisodeList(episodes);
        setMovieName(response.data.movie.name || "");

        if (episodes.length > 0 && episodes[0]?.server_data?.length > 0) {
          setCurentEpisodeSlug(episodes[0].server_data[0]?.link_embed || "");
          setIndexArrServer_data(0);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [movieSlug]);

  useEffect(() => {
    if (episodeList.length > 0 && episodeList[0]?.server_data?.length > 0) {
      setCurentEpisodeSlug(
        episodeList[0].server_data[indexArrServer_data]?.link_embed || ""
      );
    }
  }, [episodeList, indexArrServer_data]);

  const handleEpisodeClick = (slug, index) => {
    setIndexArrServer_data(index);
    navigate(`/xem-phim/${movieSlug}/${slug}`);
  };

  return (
    <SkeletonTheme
      baseColor="rgb(55, 65, 81)"
      highlightColor="rgb(80, 90, 100)"
    >
      <div className="bg-[#010810] text-white">
        <div className="text-[22px] font-semibold p-2 ml-10">
          <h2>
            {loading ? (
              <Skeleton width="500px" height="27px" />
            ) : (
              `Xem Phim ${movieName}`
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
