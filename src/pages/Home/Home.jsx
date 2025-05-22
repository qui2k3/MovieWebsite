import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../../components/movie/MovieCard";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css";

// import LazyLoad from "react-lazyload";

const getThelatestMovies = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=1"
    );
    return response.data.items; // Trả về danh sách phim
  } catch (error) {
    console.log("API Error (latest movies):", error);
    return []; // Trả về mảng rỗng khi có lỗi
  }
};

const getTheCartoons = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&sort_field=_id&sort_type=asc&limit=20"
    );
    return response.data.data.items;
  } catch (error) {
    console.log("API Error (cartoons):", error);
    return [];
  }
};

const getTheChinaMovies = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=_id&sort_type=asc&country=trung-quoc&limit=10"
    );
    return response.data.data.items;
  } catch (error) {
    console.log("API Error (China movies):", error);
    return [];
  }
};

const getTheKoreanMovies = async () => {
  try {
    const response = await axios.get(
      "https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=_id&sort_type=asc&country=han-quoc&limit=10"
    );
    return response.data.data.items;
  } catch (error) {
    console.log("API Error (Korean movies):", error);
    return [];
  }
};
const Home = () => {
  const navigate = useNavigate();
  const [moviesLastest, setMoviesMoiCapNhat] = useState([]);
  const [moviesChina, setMoviesChina] = useState([]);
  const [moviesKorean, setMoviesKorean] = useState([]);
  const [moviesCartoon, setMoviesCartoon] = useState([]);
  useEffect(() => {
    const fetchMovies = async () => {
      const latestMovies = await getThelatestMovies(); // Gọi phim mới cập nhật
      const chinaMovies = await getTheChinaMovies().then((res) => {
       setMoviesChina(res || []);}); // Gọi phim Trung Quốc
        
      const koreanMovies = await getTheKoreanMovies(); // Gọi phim Hàn Quốc
      const cartoons = await getTheCartoons(); // Gọi phim hoạt hình

      setMoviesMoiCapNhat(latestMovies || []); // Cập nhật state với dữ liệu hoặc mảng rỗng
      
      setMoviesKorean(koreanMovies || []);
      setMoviesCartoon(cartoons || []);
    };

    fetchMovies(); // Thực hiện gọi dữ liệu
  }, []);

  return (
    <>
      {/* // phim moi cap nhat */}
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-white font-semibold ">
          Phim Mới Cập Nhật
        </h2>
        <Swiper
          grabCursor={true} // Cho phép người dùng kéo slider
          spaceBetween={20} // Khoảng cách giữa các slide
          slidesPerView={2} // Số slide hiển thị cùng lúc
          breakpoints={{
    // Khi màn hình có chiều rộng từ 1024px trở lên (laptop và màn hình lớn)
    1024: {
      slidesPerView: 5,      // Hiển thị 5 slide
    },
  }}
          // navigation // Nút điều hướng
          // pagination={{ clickable: true }} // Hiển thị phân trang
          // autoplay={{ delay: 3000 }} // Tự động chuyển slide
        >
          {moviesLastest.length > 0 &&
            moviesLastest.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard movie={item} thisForUrlImageMovieLastest={moviesLastest}></MovieCard>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>
      {/* // phim trung quoc */}
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-white font-semibold ">
          Phim Trung Quốc
        </h2>
        {/* <div className="grid grid-cols-2 md:grid-cols-5 p-3 gap-5 max-w-6xl mx-auto "> */}
        <Swiper
          grabCursor={true} // Cho phép người dùng kéo slider
          spaceBetween={20} // Khoảng cách giữa các slide
          slidesPerView={2} // Số slide hiển thị cùng lúc
          breakpoints={{
    // Khi màn hình có chiều rộng từ 1024px trở lên (laptop và màn hình lớn)
    1024: {
      slidesPerView: 5,      // Hiển thị 5 slide
    },
  }}
          // navigation // Nút điều hướng
          // pagination={{ clickable: true }} // Hiển thị phân trang
          // autoplay={{ delay: 3000 }} // Tự động chuyển slide
        >
          {moviesChina.length > 0 &&
            moviesChina.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard movie={item}></MovieCard>
              </SwiperSlide>
            ))}
        </Swiper>
        {/* </div> */}
      </section>
      {/* phim han quoc */}
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-white font-semibold ">
          Phim Hàn Quốc
        </h2>
        <Swiper
          grabCursor={true} // Cho phép người dùng kéo slider
          spaceBetween={20} // Khoảng cách giữa các slide
          slidesPerView={2} // Số slide hiển thị cùng lúc
          breakpoints={{
    // Khi màn hình có chiều rộng từ 1024px trở lên (laptop và màn hình lớn)
    1024: {
      slidesPerView: 5,      // Hiển thị 5 slide
    },
  }}
          // navigation // Nút điều hướng
          // pagination={{ clickable: true }} // Hiển thị phân trang
          // autoplay={{ delay: 3000 }} // Tự động chuyển slide
        >
          {moviesKorean.length > 0 &&
            moviesKorean.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard movie={item}></MovieCard>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>
      {/* phim hoat hinh */}
      <section className="bg-[#010810] p-5 pt-10">
        <h2 className="text-[24px] pl-5 pb-5 text-white font-semibold ">
          Phim Hoạt Hình
        </h2>
        <Swiper
          grabCursor={true} // Cho phép người dùng kéo slider
          spaceBetween={20} // Khoảng cách giữa các slide
          slidesPerView={2} // Số slide hiển thị cùng lúc
          breakpoints={{
    // Khi màn hình có chiều rộng từ 1024px trở lên (laptop và màn hình lớn)
    1024: {
      slidesPerView: 5,      // Hiển thị 5 slide
    },
  }}
          // navigation // Nút điều hướng
          // pagination={{ clickable: true }} // Hiển thị phân trang
          // autoplay={{ delay: 3000 }} // Tự động chuyển slide
        >
          {moviesCartoon.length > 0 &&
            moviesCartoon.map((item) => (
              <SwiperSlide key={item.id}>
                <MovieCard movie={item}></MovieCard>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>
    </>
  );
};

export default Home;
