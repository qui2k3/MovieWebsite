import React from "react";
import {useParams} from "react-router-dom";

const MovieDetails = () => {
    console.log("trang xem thong tin phim co slug: ",useParams());
  return (
    <div className="text-red-400 bg-purple-300 h-screen">
      <p>trang xem thong tin phim</p>
    </div>
  );
};

export default MovieDetails;
