const VideoPlayer = ({ link }) => {
  return (
    <div>
      <iframe
        src={link}
        width="100%"
        height="500px"
        frameBorder="0"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};
export default VideoPlayer;
