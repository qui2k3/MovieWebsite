import React from "react";
import {useParams} from "react-router-dom";
const WatchMovie = () => {
    console.log("trang xem phim co slug: ",useParams());
  return (
    <div className="bg-purple-300 h-screen text-red-800">
      <p>trang xem phim</p>
    </div>
  );
};

export default WatchMovie;
