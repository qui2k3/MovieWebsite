import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, thisForUrlImageMovieLastest }) => {
  const navigate = useNavigate();
  return (
    <div
      key={movie.id}
      onClick={() => navigate(`/DangXemThongTinPhim/${movie.slug}`)}
      className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden"
    >
      <img
        src={thisForUrlImageMovieLastest?`${movie.poster_url}`:`https://phimimg.com/${movie.poster_url}`}
        className="w-full h-full object-cover rounded-lg group-hover:scale-125 transition-transform duration-300"
        alt="poster"
      />

      <div className="absolute bottom-0 left-0 w-full h-1/5 flex flex-col justify-center items-center text-center text-white leading-4 bg-[#080705] bg-opacity-60 transition-all duration-300 transform translate-y-full group-hover:translate-y-0">
        <h3 className="block text-center font-semibold">{movie.name}</h3>
        <span className="block text-center font-light overflow-y-hidden">
          {movie.origin_name}
        </span>
      </div>
    </div>
  );
};

export default MovieCard;
