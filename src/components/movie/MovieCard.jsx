import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MovieCard = ({ movie, thisForUrlImageMovieLastest, showNameOnHover }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imageUrl = movie.poster_url
    ? thisForUrlImageMovieLastest
      ? movie.poster_url
      : `https://phimimg.com/${movie.poster_url}`
    : null;

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div
        onClick={() => navigate(`/phim/${movie.slug}`)}
        className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            className="w-full aspect-[2/3] h-full object-cover rounded-lg group-hover:scale-125 transition-transform duration-300"
            alt={movie.name || "poster"}
          />
        ) : (
          <Skeleton
            width="100%"
            height="0"
            style={{ paddingTop: "150%" }}
            className="rounded-lg"
          />
        )}

        {/* Hiển thị tên phim luôn khi ở mobile hoặc khi showNameOnHover = false */}
        <div
          className={`absolute p-1 bottom-0 left-0 w-full h-1/5 flex flex-col justify-center text-center text-white leading-4 bg-[#080705] bg-opacity-60 transition-all duration-300 ${
            isMobile || !showNameOnHover
              ? "translate-y-0"
              : "transform translate-y-full group-hover:translate-y-0"
          }`}
        >
          <h3 className="block px-1 text-center font-semibold whitespace-nowrap overflow-hidden text-ellipsis ">
            {movie.name || <Skeleton width="80%" />}
          </h3>
          <span className="block px-1 text-center text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis ">
            {movie.origin_name || <Skeleton width="60%" />}
          </span>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// Skeleton Card
const MovieCardSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <div className="max-h-72 relative bg-white shadow-md rounded-lg overflow-hidden">
        <Skeleton
          width="100%"
          height="0"
          style={{ paddingTop: "150%" }}
          className="rounded-lg animate-wave"
        />
        <div className="absolute p-1 bottom-0 left-0 w-full h-1/5 flex flex-col justify-center text-center leading-4 bg-[#080705] bg-opacity-60">
          <h3 className="block px-1 text-center font-semibold whitespace-nowrap overflow-hidden text-ellipsis ">
            <Skeleton width="100%" />
          </h3>
          <span className="block px-1 text-center text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis ">
            <Skeleton width="100%" />
          </span>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { MovieCardSkeleton };
export default MovieCard;
