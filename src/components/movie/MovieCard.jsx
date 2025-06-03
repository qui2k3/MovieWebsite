import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, thisForUrlImageMovieLastest }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/phim/${movie.slug}`)}
      className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden"
    >
      <img
        src={
          movie.poster_url
            ? thisForUrlImageMovieLastest
              ? movie.poster_url
              : `https://phimimg.com/${movie.poster_url}`
            : "https://via.placeholder.com/150"
        }
        className="w-full aspect-[2/3] h-full object-cover rounded-lg group-hover:scale-125 transition-transform duration-300"
        alt={movie.name || "poster"}
      />
      <div className="absolute p-1 bottom-0 left-0 w-full h-1/5 flex flex-col justify-center text-center text-white leading-4 bg-[#080705] bg-opacity-60 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
        <h3 className="block px-1 text-center font-semibold whitespace-nowrap overflow-hidden text-ellipsis ">
          {movie.name}
        </h3>
        <span className="block px-1 text-center text-sm font-light whitespace-nowrap overflow-hidden text-ellipsis ">
          {movie.origin_name}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
