import React from "react";

const MovieCard = ({ movies }) => {
  return (
    <>
      {movies.length > 0 &&
        movies.map((item, index) => (
          <div
            key={item.id}
            onClick={() => navigate(`/${item.slug}`)}
            className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden "
          >
            <img
              src={item.poster_url}
              className={
                "w-full h-full object-cover rounded-lg group-hover:scale-125 transition-transform duration-300 "
              }
              alt="poster"
            />

            <div className="relative -translate-y-full w-auto h-1/5 flex flex-col justify-center items-center text-center text-white  leading-4 bg-[#080705] bg-opacity-60  ">
              <h3 className="block text-center font-semibold">{item.name}</h3>
              <span className="block text-center font-light overflow-y-hidden">
                {item.origin_name}
              </span>
            </div>
          </div>
        ))}
    </>
  );
};

export default MovieCard;
