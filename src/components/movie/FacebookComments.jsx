import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const FacebookComments = () => {
  const location = useLocation();
  const [currentURL, setCurrentURL] = useState("");

  useEffect(() => {
    const baseURL = window.location.hostname.includes("localhost")
      ? "https://random.ngrok.io"
      : window.location.origin;

    setCurrentURL(`${baseURL}${location.pathname}`);
  }, [location.pathname]);

  useEffect(() => {
    if (window.FB) {
      console.log(">> Running FB.XFBML.parse() for:", currentURL);
      window.FB.XFBML.parse();
    } else {
      console.log(">> Facebook SDK chưa tải xong!");
    }
  }, [currentURL]); // Chỉ chạy khi `currentURL` thay đổi

  return (
    <div className="p-4 bg-gray-800 shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-4">Bình luận về phim</h3>
      <div className="fb-comments text-white bg-white p-2 rounded" data-href={currentURL} data-width="100%" data-numposts="5"></div>
    </div>
  );
};

export default FacebookComments;
