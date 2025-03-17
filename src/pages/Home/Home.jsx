import axios from "axios";
import React, { useEffect, useState } from "react";
// import LazyLoad from "react-lazyload";

const getMovies = () => {
  return axios
    .get("https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1")
    .then((response) => {
      return response.data.items;
    })
    .catch((error) => {
      console.log(error);
    });
};
const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies().then((movies) => {
      console.log(movies);
      setMovies(movies);
    });
  }, []);

  return (
    <div className="bg-[#010810]">
      <img
        src="../../bg-homepage.jpg"
        alt="img-dau"
        className="w-full h-[300px] object-cover"
      ></img>
      <h2 className="text-[24px] pl-5 text-white font-semibold ">Phim Mới Cập Nhật</h2>
      <div className="grid grid-cols-5 p-3 gap-5 max-w-6xl mx-auto ">
        {movies.length > 0 &&
          movies.map((item, index) => (
            <div
              key={item.id}
              className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden  "
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
                <span className="block text-center font-light overflow-y-hidden">{item.origin_name}</span>
              </div>
            </div>
          ))}
      </div>
      
      {/* <h2 className="text-[24px] pl-5 text-white font-semibold ">Phim Hàn Quốc</h2>
      <div className="grid grid-cols-5 p-3 gap-5 max-w-6xl mx-auto ">
        {movies.length > 0 &&
          movies.map((item, index) => (
            <div
              key={item.id}
              className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden  "
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
                <span className="block text-center font-light overflow-y-hidden">{item.origin_name}</span>
              </div>
            </div>
          ))}
      </div>

      <h2 className="text-[24px] pl-5 text-white font-semibold ">Phim Trung Quốc</h2>
      <div className="grid grid-cols-5 p-3 gap-5 max-w-6xl mx-auto ">
        {movies.length > 0 &&
          movies.map((item, index) => (
            <div
              key={item.id}
              className="max-h-72 relative group bg-white shadow-md rounded-lg cursor-pointer overflow-hidden  "
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
                <span className="block text-center font-light overflow-y-hidden">{item.origin_name}</span>
              </div>
            </div>
          ))}
      </div> */}
    </div>
  );
};

export default Home;
