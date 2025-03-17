import { Routes, Route } from "react-router-dom";
import Footer from "./components/movie/Footer";
import Header from "./components/movie/Header";
import MovieDetails from "./pages/MovieDetail/MovieDetails";
import WatchMovie from "./pages/Watch/WatchMovie";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<MovieDetails />} />
        <Route path="/:slug/:episodes" element={<WatchMovie />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
