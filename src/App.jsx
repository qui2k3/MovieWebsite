import { Routes, Route } from "react-router-dom";
import Header from "./components/movie/Header";
import Footer from "./components/movie/Footer";
import Home from "./pages/Home/Home";
import BrowseMovie from "./pages/BrowseMovie/BrowseMovie";
import MovieDetails from "./pages/MovieDetail/MovieDetails";
import WatchMovie from "./pages/Watch/WatchMovie";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tim-kiem/:query" element={<BrowseMovie />} />
        <Route path="/phim/:movieSlug" element={<MovieDetails />} />
        <Route path="/xem-phim/:movieSlug/:episodeSlug" element={<WatchMovie />} />
        <Route path="/the-loai/:genre" element={<BrowseMovie />} />
        <Route path="/quoc-gia/:country" element={<BrowseMovie />} />
        <Route path="/phim-bo" element={<BrowseMovie category="phim-bo" />} />
        <Route path="/phim-le" element={<BrowseMovie category="phim-le" />} />
        <Route path="/tv-shows" element={<BrowseMovie category="tv-shows" />} />
        <Route path="/hoat-hinh" element={<BrowseMovie category="hoat-hinh" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
