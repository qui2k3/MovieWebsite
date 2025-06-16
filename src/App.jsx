import { Routes, Route } from "react-router-dom";
import Header from "./components/movie/Header";
import Footer from "./components/movie/Footer";
import Home from "./pages/Home/Home";
import BrowseMovie from "./pages/BrowseMovie/BrowseMovie";
import MovieDetails from "./pages/MovieDetail/MovieDetails";
import WatchMovie from "./pages/Watch/WatchMovie";
import WatchHistoryPage from "./pages/History/WatchHistory";
const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/tim-kiem/:query"
          element={<BrowseMovie type="search" />}
        />
        <Route path="/phim/:movieSlug" element={<MovieDetails />} />
        <Route
          path="/xem-phim/:movieSlug/:episodeSlug"
          element={<WatchMovie />}
        />
        <Route path="/lich-su-xem" element={<WatchHistoryPage />} />

        <Route path="/the-loai/:genre" element={<BrowseMovie type="genre" />} />
        <Route
          path="/quoc-gia/:country"
          element={<BrowseMovie type="country" />}
        />

        <Route path="/phim-bo" element={<BrowseMovie type="phim-bo" />} />
        <Route path="/phim-le" element={<BrowseMovie type="phim-le" />} />
        <Route path="/tv-shows" element={<BrowseMovie type="tv-shows" />} />
        <Route path="/hoat-hinh" element={<BrowseMovie type="hoat-hinh" />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
