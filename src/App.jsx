import { Routes, Route } from "react-router-dom";
import Footer from "./components/movie/Footer";
import Header from "./components/movie/Header";
import MovieDetails from "./pages/MovieDetail/MovieDetails";
import WatchMovie from "./pages/Watch/WatchMovie";
import Home from "./pages/Home/Home";
import BrowseMovie from "./pages/BrowseMovie/BrowseMovie";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TongHop/:tongHop" element={<BrowseMovie />} />
        <Route path="/DangXemThongTinPhim/:movieSlug" element={<MovieDetails />} />
        <Route path="/DangXemTap/:movieSlug/:episodeSlug" element={<WatchMovie />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
